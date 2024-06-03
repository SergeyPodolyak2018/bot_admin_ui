import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, ListItemText, OutlinedInput, SelectChangeEvent } from '@mui/material';
import MuiButton from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Button as TryItNowButton } from 'components/common';
import { Button } from 'components/features';
import { serialize } from 'object-to-formdata';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getConfig, updateBot } from 'services/api';
import {
  activeBotSelector,
  addNotification,
  fetchBots,
  fetchOrganisations,
  selectOrganisationsState,
  setShowEditWindow,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { BotFull, TConfig } from 'types';
import logger from 'utils/logger.ts';
import { getFileExtension } from '../../../../../utils/primitives/string/index.ts';
import { VisuallyHiddenInput } from '../../forms/index.ts';
import { MenuProps } from '../CreateBotForm/constants.ts';
import { ValidationState } from '../CreateBotForm/CreateBotForm.types.ts';
import styles from '../Forms.module.scss';
import { validate } from '../utils.ts';
import { inputStyle } from './const.ts';
import { BotFormFields, EditBotProps } from './EditBot.types.ts';
import { parseSplitterConfig, prepareDataForSend } from './utils.ts';

export const EditBot: FC<EditBotProps> = ({ close }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const organisations = useAppSelector(selectOrganisationsState);
  const botId = useAppSelector(activeBotSelector);

  const [botInfo, setBotInfo] = useState<BotFull | null>(null);
  const [fileName, setFileName] = useState<string | undefined>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileExt, setFileExt] = useState('');
  const [fileKeys, setFileKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedIterator, setSelectedIterator] = useState<string>('');
  const [selectedOutputKeys, setSelectedOutputKeys] = useState<string[]>([]);
  const [config, setConfig] = useState<TConfig | null>(null);
  const [isError, setIsError] = useState<ValidationState>({
    name: false,
    greeting: false,
    prompt: false,
    language: false,
  });

  // fetch bot info
  useEffect(() => {
    dispatch(fetchOrganisations()).catch((err) => {
      dispatch(setShowEditWindow(false));
      logger.error('Edit bot error', err);
    });

    getConfig(`${botId}`)
      .then((res) => {
        setBotInfo(res.data.bot);
        res.data.files[0]?.name && setFileName(res.data.files[0].name);
        res.data.files[0]?.keys && setFileKeys(res.data.files[0].keys);
        setConfig(res.data);

        if (res.data.categories[0]?.splitterConfig) {
          const { iterator, keysInTemplate, keysInOutput } = parseSplitterConfig(res.data.categories[0].splitterConfig);

          setSelectedIterator(iterator);
          setSelectedKeys(keysInTemplate);
          setSelectedOutputKeys(keysInOutput);
        }
        // fetchFileById(res.data.file.id).then((r) => setFileData(r.data));
      })
      .catch((err) => {
        dispatch(setShowEditWindow(false));
        logger.error('Edit bot error', err);
      });
  }, [botId]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target?.files && event.target?.files[0];
    if (!file) return;

    setFileName(file.name);
    setFile(file);
    setFileExt(getFileExtension(file.name));
    setSelectedKeys([]);
    setSelectedIterator('');
    setSelectedOutputKeys([]);

    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      if (!e.target?.result) return;
      const jsonFile = JSON.parse(e.target.result as string);
      setFileKeys(Object.keys(jsonFile[0]));
    };
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
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const entries = Object.fromEntries(data);
    const fields = {
      ...entries,
      output: selectedOutputKeys,
      search: selectedKeys,
      iterator: selectedIterator ? selectedIterator : undefined,
      categoryId: botInfo?.category.id,
      promptId: botInfo?.prompt.id,
      fileId: config?.files[0].id,
      botPrompt: botInfo?.botPrompt || '',
      extension: fileExt || botInfo?.file.extension,
    } as BotFormFields;

    const { errors, isValid } = validate(fields, isError);

    setIsError(errors);
    if (!isValid) return;

    const preparedData = prepareDataForSend(fields, config?.categories?.length);
    const formData = serialize(preparedData);
    logger.info(`update bot:`, preparedData);

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

          await saveData(formData, botId);
        };
      } else {
        await saveData(formData, botId);
      }
    } catch (err) {
      logger.error('update error', err);
    }
  };

  const saveData = async (formData: FormData, botId: string | number) => {
    await updateBot(formData, botId)
      .then(() => {
        dispatch(fetchBots());
        dispatch(setShowEditWindow(false));
        dispatch(addNotification({ message: 'Updated', type: 'success', title: '' }));
      })
      .catch((err) => {
        logger.error(err);
        dispatch(addNotification({ message: 'Error with update', type: 'error', title: '' }));
      });
  };

  const resetSelectedFile = () => {
    setFileName(config?.files[0].name);
    setFile(null);
    setFileKeys(config?.files[0].keys || []);
    setFileExt('');
  };

  if (!botInfo || !config) return <></>;
  return (
    <div className={styles.tipicalForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>{t('configurationPageFeatures.updateBot')}</div>
        <div className={styles.body}>
          <FormControl fullWidth style={{ marginTop: '10px', width: '90%' }}>
            <InputLabel id="demo-simple-select-label">{t('configurationPageFeatures.organizations')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label={t('configurationPageFeatures.organizations')}
              name="organizationId"
              defaultValue={botInfo.organization.id}
            >
              {organisations.data.map((el) => (
                <MenuItem value={el.id} key={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {
            <>
              <TextField
                error={isError.name}
                style={inputStyle}
                id={'name'}
                name={'name'}
                label={t('botList.name')}
                variant="standard"
                defaultValue={botInfo.name}
                type={'text'}
              />
              <TextField
                error={isError.greeting}
                style={inputStyle}
                id={'greeting'}
                name={'greeting'}
                label={t('configurationPageFeatures.welcomeMessage')}
                variant="standard"
                defaultValue={botInfo.greeting}
                multiline={true}
                rows={2}
                type={'text'}
              />
              {config?.prompts.length < 2 && (
                <TextField
                  style={inputStyle}
                  error={isError.prompt}
                  id={'prompt'}
                  name={'prompt'}
                  label={t('configurationPageFeatures.prompt')}
                  variant="standard"
                  defaultValue={config?.prompts[0].text}
                  multiline={true}
                  rows={8}
                  type={'text'}
                />
              )}
              <TextField
                error={isError.language}
                style={inputStyle}
                id={'language'}
                name={'language'}
                label={t('configurationPageFeatures.languageCode')}
                variant="standard"
                defaultValue={botInfo.language}
                type={'text'}
              />
              <FormControlLabel
                style={inputStyle}
                label={t('configurationPageFeatures.useContext')}
                control={<Checkbox name={'useContext'} defaultChecked={botInfo.useContext} />}
              />
              <FormControlLabel
                style={{ ...inputStyle }}
                label={t('configurationPageFeatures.useRemarks')}
                control={<Checkbox name={'useRemarks'} defaultChecked={botInfo.useRemarks} />}
              />
              <FormControlLabel
                style={{ ...inputStyle }}
                label={t('configurationPageFeatures.useHistory')}
                control={<Checkbox name={'useHistory'} defaultChecked={botInfo.useHistory} />}
              />
              {config?.categories?.length < 2 && (
                <div
                  style={{
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {file ? (
                    <CloseIcon
                      onClick={resetSelectedFile}
                      sx={{ mt: '25px', width: '25px', height: '25px', cursor: 'pointer' }}
                    />
                  ) : (
                    <Box sx={{ width: '25px', heigth: '25px' }}></Box>
                  )}
                  <TextField
                    key="fileName"
                    id="fileName"
                    name={'file'}
                    disabled
                    label={t('configurationPageFeatures.fileName')}
                    variant="standard"
                    style={{ ...inputStyle, width: '65%' }}
                    value={fileName}
                  />
                  <MuiButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    style={{ backgroundColor: '#ffffff', color: '#1f1f1f', border: '1px solid #1f1f1f' }}
                    startIcon={<CloudUploadIcon />}
                  >
                    {t('configurationPageFeatures.uploadFile')}
                    <VisuallyHiddenInput
                      type="file"
                      name="file"
                      required={false}
                      accept=".json"
                      onChange={(event) => handleFileChange(event)}
                    />
                  </MuiButton>
                </div>
              )}
            </>
          }
          {fileKeys.length !== 0 && config?.categories?.length < 2 && (
            <FormControl sx={{ mt: 3, width: '90%' }}>
              <InputLabel id="iterator">{t('configurationPageFeatures.iterator')}</InputLabel>
              <Select
                labelId="iterator"
                id="Iterator"
                value={selectedIterator}
                onChange={handleSelectedIteratorsChange}
                input={<OutlinedInput label={t('configurationPageFeatures.iterator')} />}
                renderValue={(selected) => selected}
                MenuProps={MenuProps}
              >
                {fileKeys.map((name) => (
                  <MenuItem key={name} value={name}>
                    {/*<Checkbox checked={selectedIterator.indexOf(name) > -1} />*/}
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {fileKeys.length !== 0 && config?.categories?.length < 2 && (
            <FormControl sx={{ mt: 3, width: '90%' }}>
              <InputLabel id="template">{t('configurationPageFeatures.fieldsForSearch')}</InputLabel>
              <Select
                labelId="template"
                id="template-input"
                multiple
                value={selectedKeys}
                onChange={handleSelectedKeysChange}
                input={<OutlinedInput label={t('configurationPageFeatures.fieldsForSearch')} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {fileKeys.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedKeys.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {fileKeys.length !== 0 && config?.categories?.length < 2 && (
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
                MenuProps={MenuProps}
              >
                {fileKeys.map((name) => (
                  <MenuItem key={name} value={name}>
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
            onClick={close}
            label={t('configurationPageFeatures.close')}
            style={{ height: '48px', width: '130px' }}
          />
          <TryItNowButton
            label={t('configurationPageFeatures.send')}
            style={{ height: '48px', marginLeft: '20px', width: '130px' }}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};
