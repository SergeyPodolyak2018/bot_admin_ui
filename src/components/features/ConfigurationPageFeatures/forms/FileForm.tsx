import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import classnames from 'classnames/bind';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import logger from 'utils/logger.ts';
import { postFiles } from '../../../../services/api/index.ts';
import {
  addNewIndependentFile,
  getConfig as getConfigSelector,
  showExistingIndependentFile,
  useAppSelector,
} from '../../../../store/index.ts';
import { TConfig, TConfigFile, TFile } from '../../../../types/index.ts';
import { idCreator } from '../../../../utils/botUtils.ts';
import { getFileExtension } from '../../../../utils/primitives/string/index.ts';
import { Button as TryItNowButton } from '../../../common/index.ts';
import { Button as CustomButton } from '../../LandingPageFeatures/index.ts';
import stylesMain from '../forms2/Forms.module.scss';
import { TFormProps } from './Form.types.ts';
import styles from './Forms.module.scss';
import { getDefaultFileWithData } from 'utils/template.ts';
import { useDispatch } from 'react-redux';

const cx = classnames.bind(styles); // <-- explicitly bind your styles
export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const FileForm = ({ data, createNode, close, idSaver }: TFormProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { botId } = useParams();
  const config = useAppSelector(getConfigSelector);
  const [file, setFile] = useState<TFile | null>(null);
  const [allFiles, setAllFiles] = useState<TFile[]>([]);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [uploadedFileExt, setUploadedFileExt] = useState('');

  const className = cx({
    [styles.tipicalForm]: true,
  });
  const classBody = cx({
    [stylesMain.body]: true,
    [styles.midle]: true,
  });

  const fileSelectChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files && event.target?.files[0];
    if (!file) return;
    const ext = getFileExtension(file.name);
    setSelectedFile(file.name.replace(`.${ext}`, ''));
    setUploadedFile(true);
    setUploadedFileExt(ext);
  };
  const changeFileName = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.value);
  };
  useEffect(() => {
    if (allFiles.length === 0 && botId) {
      const conectedFileList = config.categories.map((el) => {
        if (el.file && el.file.id) {
          return el.file.id;
        }
      });
      const filteredfiles =
        config.files.filter((el) => {
          if (!conectedFileList.includes(el.id)) {
            return el;
          }
        }) || [];
      setAllFiles(filteredfiles);
    }
  }, [botId]);
  const create = () => {
    dispatch(showExistingIndependentFile({ fileId: file?.id || 0, design: JSON.stringify({ x: data.x, y: data.y }) }));
    const newNode = {
      id: idCreator('file', file?.id || 1),
      type: 'file',
      data: { label: file?.name, value: file?.id },
      position: { x: data.x, y: data.y },
    };
    createNode((nds) => nds.concat(newNode));
    close();
  };
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (!file) {
  //     const formData = new FormData(event.currentTarget);
  //     formData.delete('existingFile');
  //     formData.set('botId', '' + config.bot?.recordId);
  //     formData.set('organizationId', '' + config.bot?.organization.id);
  //     const file = formData.get('file') as File;
  //     formData.set('extension', uploadedFileExt);
  //     const reader = new FileReader();
  //     reader.readAsText(file);
  //     reader.onload = async function (event) {
  //       const blob = new Blob([event?.target?.result as string], {
  //         type: 'text/plain',
  //       });
  //       formData.set('file', blob);
  //       try {
  //         const resp = (await postFiles(formData)).data;

  //         const newNode = {
  //           id: idCreator('file', resp?.id || 1),
  //           type: 'file',
  //           data: { label: resp?.name, value: resp?.id },
  //           position: { x: data.x, y: data.y },
  //         };

  //         createNode((nds) => nds.concat(newNode));
  //         close();
  //       } catch (err) {
  //         logger.error(err);
  //       }
  //     };
  //   } else {
  //     create();
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      const unionid = idSaver.newId - 1;
      const formData = new FormData(event.currentTarget);

      const file = formData.get('file') as File;

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async function (event) {
        const blob = new Blob([event?.target?.result as string], {
          type: 'text/plain',
        });
        const enc = new TextEncoder();
        const rez = enc.encode(event?.target?.result as string);
        const extension = uploadedFileExt as 'csv' | 'txt' | 'json' | '';
        const fileObject: TConfigFile = getDefaultFileWithData(
          selectedFile + uploadedFileExt,
          unionid,
          config.bot?.id || '',
          config.bot?.organization.id as number,
          config.bot?.organization.name as string,
          rez,
          extension,
        );
        console.log(fileObject);
        fileObject['tempShowInSchema'] = true;
        fileObject['tempDisign'] = JSON.stringify({ x: data.x, y: data.y });

        dispatch(addNewIndependentFile({ file: fileObject }));
        try {
          const newNode = {
            id: idCreator('file', unionid),
            type: 'file',
            data: { label: selectedFile, value: unionid },
            position: { x: data.x, y: data.y },
          };

          createNode((nds) => nds.concat(newNode));
          idSaver.iterate(unionid);

          close();
        } catch (err) {
          logger.error(err);
        }
      };
    } else {
      create();
    }
  };

  // const createNewFile = (extension: 'csv' | 'txt' | 'json') => {
  //   const enc = new TextEncoder();
  //   let defaultText = '';
  //   if (extension === 'csv') {
  //     defaultText = '"column",\n"value"';
  //   }
  //   if (extension === 'json') {
  //     defaultText = '{}';
  //   }

  //   const rez = enc.encode(defaultText);
  //   // const activeFile = csvToJSON(text as string);

  //   const unionid = props.idSaver.newId - 1;
  //   const name = '';

  //   const file = getDefaultFileWithData(
  //     name,
  //     unionid,
  //     props.data.bot?.id || '',
  //     props.data.bot?.organization.id as number,
  //     props.data.bot?.organization.name as string,
  //     rez,
  //     extension,
  //   );

  //   //changeCategoty(tempCategory as unknown as TCategore);
  //   if (!activeCategory) return;
  //   dispatch(addNewFile({ categotyid: activeCategory, file }));

  //   props.idSaver.iterate(unionid);
  // };

  const handleChange = (e: SelectChangeEvent) => {
    const id = e.target.value;
    const selectedFile = allFiles.find((el) => el.id === Number(id));
    setFile(selectedFile!);
    setUploadedFileExt(selectedFile?.extension || '');
  };

  return (
    <div className={styles.blureWrap}>
      <div className={className}>
        <form onSubmit={handleSubmit}>
          <div className={stylesMain.header}>{t('configurationPageFeatures.addFile')}</div>
          <div className={classBody}>
            <FormControl fullWidth style={{ marginTop: '20px', width: '90%' }}>
              <InputLabel id="demo-simple-select-label">{t('configurationPageFeatures.files')}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t('configurationPageFeatures.organizations')}
                name="existingFile"
                value={String(file?.id)}
                onChange={handleChange}>
                {allFiles.map((el) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className={stylesMain.gorisontal}>
              <TextField
                id="fileName"
                name="name"
                label={t('configurationPageFeatures.fileName')}
                variant="standard"
                style={{ width: '50%' }}
                value={selectedFile}
                onChange={changeFileName}
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                style={{ backgroundColor: '#ffffff', color: '#1f1f1f', border: '1px solid #1f1f1f' }}
                startIcon={uploadedFile ? <CloudDoneIcon /> : <CloudUploadIcon />}>
                {t('configurationPageFeatures.uploadFile')}
                <VisuallyHiddenInput type="file" name="file" accept=".csv,.txt,.json" onChange={fileSelectChanged} />
              </Button>
            </div>
          </div>
          <div className={stylesMain.footer}>
            <CustomButton
              onClick={close}
              label={t('configurationPageFeatures.close')}
              style={{ height: '48px', width: '130px' }}
            />
            <TryItNowButton
              label={t('configurationPageFeatures.send')}
              style={{ height: '48px', marginLeft: '20px', width: '130px' }}
              type="submit"
            />

            {/* <Button variant="outlined" onClick={close}>
              Close
            </Button>
            <Button
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
              style={{ marginLeft: '20px' }}
            >
              Add
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
};
