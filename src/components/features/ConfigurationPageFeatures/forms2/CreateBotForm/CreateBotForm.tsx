import { ListItemText, OutlinedInput, SelectChangeEvent } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import cx from 'classnames';
import { Button as TryItNowButton } from 'components/common';
import { Button } from 'components/features';
import { serialize } from 'object-to-formdata';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { postBot } from 'services/api';
import {
  addNotification,
  fetchBots,
  fetchOrganisations,
  selectOrganisationsState,
  setShowEditWindow,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { TBotFields } from 'types';
import logger from 'utils/logger.ts';
import { getFileExtension } from '../../../../../utils/primitives/string/index.ts';
import { botFields } from '../const.ts';
import styles from '../Forms.module.scss';
import { FieldsGenerator } from '../Forms.tsx';
import { validate } from '../utils.ts';
import { MenuProps } from './constants.ts';
import { BotFormFields, ValidationState } from './CreateBotForm.types.ts';
import { prepareDataForSend } from './utils.ts';

export const CreateBotForm = (props: { data: TBotFields; close: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const organisations = useAppSelector(selectOrganisationsState);
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileExt, setFileExt] = useState('');
  const [fileKeys, setFileKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedIterator, setSelectedIterator] = useState<string>('');
  const [selectedOutputKeys, setSelectedOutputKeys] = useState<string[]>([]);
  const [isError, setIsError] = useState<ValidationState>({
    name: false,
    greeting: false,
    prompt: false,
    language: false,
  });

  const className = cx({
    [styles.tipicalForm]: true,
  });

  useEffect(() => {
    dispatch(fetchOrganisations());
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const entries = Object.fromEntries(data);
    const fields = {
      ...entries,
      output: selectedOutputKeys,
      search: selectedKeys,
      iterator: selectedIterator,
      extension: fileExt,
    } as BotFormFields;

    const { errors, isValid } = validate(fields, isError);
    setIsError(errors);
    if (!isValid) return;

    const preparedData = prepareDataForSend(fields);
    const formData = serialize(preparedData);
    logger.info(`create bot:`, preparedData);

    try {
      const reader = new FileReader();

      if (file) {
        reader.readAsText(file, 'UTF-8');
        reader.onload = async (e) => {
          if (!e.target?.result) return;
          const blob = new Blob([e?.target?.result], {
            type: 'text/plain',
          });
          formData.append('config[file][data]', blob);

          await saveData(formData);
        };
      } else {
        const emptyArray = JSON.stringify([{}]);
        const emptyBlob = new Blob([emptyArray], {
          type: 'text/plain',
        });
        formData.append('config[file][data]', emptyBlob);

        await saveData(formData);
      }
    } catch (err) {
      logger.error(err);
    }
  };

  const saveData = async (formData: FormData) => {
    await postBot(formData)
      .then(() => {
        dispatch(fetchBots());
        dispatch(setShowEditWindow(false));
        dispatch(addNotification({ message: t('configurationPageFeatures.created'), type: 'success', title: '' }));
      })
      .catch((err: any) => {
        logger.error(err);
        const message = err.response?.data?.message
          ? err.response.data.message
          : t('configurationPageFeatures.errorWithCreating');

        dispatch(addNotification({ message: message, type: 'error', title: 'Error' }));
      });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target?.files && event.target?.files[0];
    if (!file) return;

    setFileName(file.name);
    setFile(file);
    setFileExt(getFileExtension(file.name));
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      if (!e.target?.result) return;
      const jsonFile = JSON.parse(e.target.result as string);
      setFileKeys(Object.keys(jsonFile[0]));
    };
  };

  const resetSelectedFile = () => {
    setFileName('');
    setFile(null);
    setFileKeys([]);
  };

  const handleSelectedKeysChange = (event: SelectChangeEvent<typeof selectedKeys>) => {
    const {
      target: { value },
    } = event;
    setSelectedKeys(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSelectedOutputKeysChange = (event: SelectChangeEvent<typeof selectedKeys>) => {
    const {
      target: { value },
    } = event;
    setSelectedOutputKeys(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSelectedIteratorsChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedIterator(value);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>Create Bot</div>
        <div className={styles.body}>
          <FormControl style={{ marginTop: '10px', width: '90%' }}>
            <InputLabel id="demo-simple-select-label">{t('configurationPageFeatures.organizations')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Organizations"
              name="organizationId"
              defaultValue={organisations.data[0]?.id || props.data.id}>
              {organisations.data.map((el) => (
                <MenuItem value={el.id} key={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {botFields.map((el, index) => {
            return FieldsGenerator({
              ...el,
              key: index,
              value: props.data[el.name as keyof TBotFields],
              isError:
                isError[el.name as keyof ValidationState] === undefined
                  ? true
                  : isError[el.name as keyof ValidationState],
              fileHandler: handleFileChange,
              fileName: fileName,
              resetSelectedFile,
            });
          })}
          {fileKeys.length !== 0 && (
            <FormControl sx={{ marginTop: 3, width: '90%' }}>
              <InputLabel id="iterator">{t('configurationPageFeatures.iterator')}</InputLabel>
              <Select
                labelId="iterator"
                id="Iterator"
                value={selectedIterator}
                onChange={handleSelectedIteratorsChange}
                input={<OutlinedInput label={t('configurationPageFeatures.iterator')} />}
                renderValue={(selected) => selected}
                MenuProps={MenuProps}>
                {fileKeys.map((name) => (
                  <MenuItem key={name} value={name}>
                    {/*<Checkbox checked={selectedIterator.indexOf(name) > -1} />*/}
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {fileKeys.length !== 0 && (
            <FormControl sx={{ marginTop: 3, width: '90%' }}>
              <InputLabel id="template">{t('configurationPageFeatures.fieldsForSearch')}</InputLabel>
              <Select
                labelId="template"
                id="template-input"
                multiple
                value={selectedKeys}
                onChange={handleSelectedKeysChange}
                input={<OutlinedInput label={t('configurationPageFeatures.fieldsForSearch')} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}>
                {fileKeys.map((name, index) => (
                  <MenuItem key={`${name}${index - 100}`} value={name}>
                    <Checkbox checked={selectedKeys.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {fileKeys.length !== 0 && (
            <FormControl sx={{ marginTop: 3, width: '90%' }}>
              <InputLabel id="output">{t('configurationPageFeatures.fieldsForAnswerGeneration')}</InputLabel>
              <Select
                labelId="output"
                id="output-input"
                multiple
                value={selectedOutputKeys}
                onChange={handleSelectedOutputKeysChange}
                input={<OutlinedInput label={t('configurationPageFeatures.fieldsForAnswerGeneration')} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}>
                {fileKeys.map((name, index) => (
                  <MenuItem key={`${name}${index + 100}`} value={name}>
                    <Checkbox checked={selectedOutputKeys.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <div className={styles.footer}>
          <Button
            onClick={props.close}
            label={t('configurationPageFeatures.close')}
            style={{ height: '48px', width: '130px' }}
          />
          <TryItNowButton
            label={t('configurationPageFeatures.create')}
            style={{ height: '48px', marginLeft: '20px', width: '130px' }}
            type="submit"
          />
          {/* <Button variant="outlined" onClick={props.close}>
            Close
          </Button>
          <TryItNowButton variant="contained" type="submit" endIcon={<SendIcon />} style={{ marginLeft: '20px' }} >
            Send
          </Button> */}
        </div>
      </form>
    </div>
  );
};
