import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { postPrompt } from 'services/api';
import {
  addNewIndependentPrompt,
  showExistingIndependentPrompt,
  getConfig as getConfigSelector,
  useAppSelector,
} from 'store';
import { TConfigPrompt, TPromt, TPromtPayload } from 'types';
import { fieldsSerializer, idCreator } from 'utils/botUtils.ts';
import logger from 'utils/logger.ts';
import { Button as TryItNowButton } from '../../../common/index.ts';
import { Button as CustomButton } from '../../LandingPageFeatures/index.ts';
import { promtFields } from '../forms2/const.ts';
import stylesMain from '../forms2/Forms.module.scss';
import { TFormProps } from './Form.types.ts';
import styles from './Forms.module.scss';
import { getDefaultFileWithData, getDefaultPromptWithData } from 'utils/template.ts';
import { useDispatch } from 'react-redux';

const cx = classnames.bind(styles); // <-- explicitly bind your styles
export const PromtForm = ({ data, createNode, close, idSaver }: TFormProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { botId } = useParams();

  const config = useAppSelector(getConfigSelector);
  const [prompt, setPromt] = useState<TPromt | null>(null);
  const [allPrompts, setAllPrompts] = useState<TPromt[]>([]);

  const className = cx({
    [styles.tipicalForm]: true,
  });
  const classBody = cx({
    [stylesMain.body]: true,
    [styles.midle]: true,
  });

  useEffect(() => {
    if (allPrompts.length === 0 && botId) {
      const conectedPromptList = config.categories.map((el) => {
        if (el.prompt && el.prompt.id) {
          return el.prompt.id;
        }
      });
      const filteredfPrompts =
        config.prompts.filter((el) => {
          if (!conectedPromptList.includes(el.id)) {
            return el;
          }
        }) || [];
      setAllPrompts(filteredfPrompts);
    }
  }, [botId]);

  const create = () => {
    dispatch(
      showExistingIndependentPrompt({ promptId: prompt?.id || 0, design: JSON.stringify({ x: data.x, y: data.y }) }),
    );
    const newNode = {
      id: idCreator('promt', prompt?.id || 1),
      type: 'promt',
      data: { label: prompt?.name, value: prompt?.id },
      position: { x: data.x, y: data.y },
    };

    createNode((nds) => nds.concat(newNode));
    close();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt) {
      const unionid = idSaver.newId - 1;
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name');
      const isNoSource = formData.get('isNoSource') === 'on' ? true : false;
      const text = formData.get('text') as string;

      const promptObject: TConfigPrompt = getDefaultPromptWithData(
        (name as string) || '',
        unionid,
        config.bot?.organization.id as number,
        config.bot?.organization.name as string,
        text,
        isNoSource as boolean,
      );
      promptObject['tempShowInSchema'] = true;
      promptObject['tempDisign'] = JSON.stringify({ x: data.x, y: data.y });

      try {
        //const resp = (await postPrompt(preparedData)).data;
        dispatch(addNewIndependentPrompt({ prompt: promptObject }));
        const newNode = {
          id: idCreator('promt', unionid),
          position: { x: data.x, y: data.y },
          type: 'promt',
          data: { label: name, value: unionid },
        };
        createNode((nds) => nds.concat(newNode));
        idSaver.iterate(unionid);
      } catch (err) {
        logger.error(err);
      }
      close();
    } else {
      create();
    }
  };

  const handleChange = (e: SelectChangeEvent) => {
    const id = e.target.value;
    const selectedPrompt = allPrompts.find((el) => el.id === Number(id));
    setPromt(selectedPrompt!);
  };

  return (
    <div className={styles.blureWrap}>
      <div className={className}>
        <form onSubmit={handleSubmit}>
          <div className={stylesMain.header}>{t('configurationPageFeatures.addPrompt')}</div>
          <div className={classBody}>
            <FormControl fullWidth style={{ marginTop: '20px', width: '90%' }}>
              <InputLabel id="demo-simple-select-label">{t('configurationPageFeatures.prompts')}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t('configurationPageFeatures.organizations')}
                name="existingPromptId"
                value={String(prompt?.id)}
                onChange={handleChange}>
                {allPrompts.map((el) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="fileName"
              name="name"
              label={t('configurationPageFeatures.promptName')}
              variant="standard"
              style={{ width: '90%' }}
              required
            />
            <FormControlLabel
              style={{ width: '90%' }}
              control={<Checkbox name="isNoSource" />}
              label={t('configurationPageFeatures.isNoSource')}
            />
            {/* <TextField
              id="fileName"
              name="isNoSource"
              label="Is No Source"
              type="number"
              variant="standard"
              InputProps={{ inputProps: { min: 0, max: 1, step: 1 } }}
              style={{ width: '90%' }}
            /> */}
            <TextField
              id="fileName"
              name="text"
              label={t('configurationPageFeatures.promptText')}
              variant="standard"
              multiline
              rows={5}
              style={{ width: '90%' }}
            />
          </div>

          <div className={stylesMain.footer}>
            <CustomButton
              onClick={close}
              label={t('configurationPageFeatures.close')}
              style={{ height: '48px', width: '130px' }}
            />
            <TryItNowButton
              label={t('configurationPageFeatures.create')}
              style={{ height: '48px', marginLeft: '20px', width: '130px' }}
              type="submit"
              onClick={() => {}}
            />
            {/* <Button variant="outlined" onClick={close}>
              Close
            </Button>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} style={{ marginLeft: '20px' }}>
              Add
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
};
