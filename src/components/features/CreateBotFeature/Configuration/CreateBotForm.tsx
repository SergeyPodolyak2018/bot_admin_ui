import { styled } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import cx from 'classnames';
import { Button as TryItNowButton, Checkbox, Tooltip } from 'components/common';
import { CustomDropDownIcon } from 'components/common/CustomDropDownIcon/CustomDropDownIcon';
import { NavigationEnum } from 'navigation';
import { serialize } from 'object-to-formdata';
import { ChangeEvent, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useStateRef from 'react-usestateref';
import { postBot } from 'services/api';
import { addNotification, selectOrganisationsState, useAppDispatch, useAppSelector } from 'store';
import { ClassNames } from 'types';
import { checkFields } from 'utils/botUtils';
import IdCardIcon from '../../../../assets/svg/IdCardIcon.svg';
import OrganizationIcon from '../../../../assets/svg/OrganizationIcon.svg';
import PsychologyIcon from '../../../../assets/svg/PsychologyIcon.svg';
import HandIcon from '../../../../assets/svg/WavingHeadIcon.svg';
import styles from '../../TemplateBotConfigFeature/Configuration/templateConfiguration.module.scss';

type TProps = {
  classNames?: ClassNames;
  setLoading: (value: boolean) => void;
};

const StyledTextField = styled(TextField)({
  height: '100%',
  fontSize: 'inherit',
  '& .MuiInputBase-root': {
    height: '100%',
    display: 'flex',
    alignItems: 'start',
    fontSize: 'inherit',
  },
});

export const CreateBotForm = (props: TProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const organisations = useAppSelector(selectOrganisationsState);
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState(-1);
  const [greeting, setGreeting] = useState('');
  const [useContext, setUseContext] = useState(false);
  const [useHistory, setUseHistory] = useState(false);
  const [useRemarks, setUseRemarks] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [, setDisable, disableButtonRef] = useStateRef<boolean>(true);

  const [touched, setTouched] = useState({
    name: false,
    organization: false,
    greeting: false,
    prompt: false,
  });

  const openTemplates = (id: number) => {
    navigate(`${NavigationEnum.AI_AGENT_CONFIG}/${id}`);
  };

  useEffect(() => {
    if (name !== '' && promptText !== '' && organisation > 0 && greeting !== '') {
      setDisable(false);
      return;
    }
    setDisable(true);
  }, [name, organisation, promptText, greeting]);

  const changeSelect = (event: SelectChangeEvent<string>) => {
    setOrganisation(Number(event.target.value));
    setTouched((prevState) => ({ ...prevState, organization: true }));
  };
  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setTouched((prevState) => ({ ...prevState, name: true }));
  };
  const changeGreeting = (event: ChangeEvent<HTMLInputElement>) => {
    setGreeting(event.target.value);
    setTouched((prevState) => ({ ...prevState, greeting: true }));
  };
  const changePromptText = (event: ChangeEvent<HTMLInputElement>) => {
    setPromptText(event.target.value);
    setTouched((prevState) => ({ ...prevState, prompt: true }));
  };
  const handleSubmit = async () => {
    const message = checkFields('bot', 'greeting', greeting);
    if (message) {
      dispatch(addNotification({ type: 'error', title: 'Field Error', message: message }));
      return;
    }
    setDisable(true);
    props.setLoading(true);
    const bot = {
      botPrompt: promptText,
      name: name,
      organizationId: organisation,
      language: 'en',
      greeting: greeting,
      useContext,
      useRemarks,
      useHistory,
    };
    const data = serialize(bot);
    await saveData(data);
  };

  const saveData = async (formData: FormData) => {
    await postBot(formData)
      .then((data) => {
        dispatch(addNotification({ message: t('configurationPageFeatures.created'), type: 'success', title: '' }));
        openTemplates(data.data.id);
      })
      .catch((err: any) => {
        setDisable(false);
        props.setLoading(false);
        const message = err.response?.data?.message
          ? err.response.data.message
          : t('configurationPageFeatures.errorWithCreating');
        dispatch(addNotification({ message: message, type: 'error', title: 'Error' }));
      });
  };

  return (
    <div className={cx(styles.container, props.classNames)}>
      {/*<div className={styles.mainHeader}>{t('TemplateBotConfig.agentConfiguration')}</div>*/}
      <div className={styles.subwrapper} style={{ height: '100%' }}>
        <div className={styles.sectionsWrapper}>
          <div className={styles.subcontainer}>
            <div className={styles.fieldContainer}>
              <div className={styles.hader}>
                <span className={styles.holderContainer}>
                  <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={OrganizationIcon} />
                </span>
                <div className={styles.textWithTooltip}>
                  <span className={styles.textHolder}>Organization</span>
                  <Tooltip
                    iconClassName={styles.tooltipIcon}
                    text="Select the organization to which the agent will belong"
                    withIcon
                    arrow
                    placement={'right'}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <FormControl
                  sx={{
                    width: '100%',
                    fontFamily: 'inherit',
                    '& .MuiFormHelperText-root': {
                      height: '21px',
                    },
                    paddingBottom: '24px',
                  }}>
                  <Select
                    IconComponent={CustomDropDownIcon}
                    sx={{
                      borderRadius: '10px',
                      color: '#1f1f1f',

                      '& .MuiSelect-select': {
                        padding: '14px',
                        paddingTop: '16px',
                      },
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="organizationId"
                    value={String(organisation)}
                    MenuProps={{
                      MenuListProps: {
                        sx: { padding: 0 },
                      },
                      PaperProps: {
                        sx: {
                          marginTop: '4px',
                          borderRadius: '10px',
                          border: '1px solid #D8DBDF',
                          boxShadow: '0px 0px 3px 0px #0655F340',
                        },
                      },
                    }}
                    onChange={changeSelect}>
                    {organisations.data.map((el) => (
                      <MenuItem
                        key={el.id}
                        value={el.id}
                        sx={{
                          padding: '7px',
                          margin: '7px',
                          borderRadius: '5px',
                        }}>
                        <span className={styles.menuItemLabel}>{el.name}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className={styles.fieldContainer}>
              <div className={styles.hader}>
                <span className={styles.holderContainer}>
                  <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={IdCardIcon} />
                </span>
                <div className={styles.textWithTooltip}>
                  <span className={styles.textHolder}>Agent Name</span>
                  <Tooltip
                    iconClassName={styles.tooltipIcon}
                    text="Please indicate what your agent should be called"
                    withIcon
                    arrow
                    placement={'right'}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <FormControl
                  sx={{
                    width: '100%',
                    '& .MuiFormHelperText-root': {
                      height: '21px',
                    },
                    paddingBottom: touched.name && name.length === 0 ? '0' : '24px',
                  }}>
                  <TextField
                    style={{ borderRadius: '10px', color: '#1f1f1f' }}
                    id={'name'}
                    name={'name'}
                    placeholder="Enter Your Bot's Name"
                    variant="outlined"
                    value={name}
                    error={touched.name && name.length === 0}
                    helperText={touched.name && name.length === 0 ? 'Should be not empty' : ''}
                    multiline={false}
                    type={'text'}
                    onChange={changeName}
                    InputProps={{
                      style: {
                        borderRadius: '10px',
                        width: '100%',
                      },
                      sx: {
                        '& .MuiInputBase-input': {
                          minWidth: 'calc(100% - 30px)',
                          padding: '14px',
                          paddingTop: '16px',
                        },
                      },
                    }}
                  />
                </FormControl>
              </div>
            </div>

            <div className={styles.fieldContainer}>
              <div className={styles.hader}>
                <span className={styles.holderContainer}>
                  <img alt={''} className={`${styles.iconHolder} `} src={HandIcon} />
                </span>
                <div className={styles.textWithTooltip}>
                  <span className={styles.textHolder}>Welcome Message</span>
                  <Tooltip
                    iconClassName={styles.tooltipIcon}
                    text="Add a welcome message with which the agent will contact the user"
                    withIcon
                    arrow
                    placement={'right'}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <FormControl
                  sx={{
                    width: '100%',
                    '& .MuiFormHelperText-root': {
                      height: '21px',
                    },
                    paddingBottom: touched.greeting && greeting.length === 0 ? '0' : '24px',
                  }}>
                  <TextField
                    style={{ borderRadius: '10px', color: '#1f1f1f' }}
                    id={'greeting'}
                    name={'greeting'}
                    placeholder="Enter Welcome Message"
                    variant="outlined"
                    value={greeting}
                    error={touched.greeting && greeting.length === 0}
                    helperText={touched.greeting && greeting.length === 0 ? 'Should be not empty' : ''}
                    onChange={changeGreeting}
                    multiline={false}
                    type={'text'}
                    InputProps={{
                      style: {
                        width: '100%',
                        borderRadius: '10px',
                      },
                      sx: {
                        '& .MuiInputBase-input': {
                          minWidth: 'calc(100% - 30px)',
                          padding: '14px',
                          paddingTop: '16px',
                        },
                      },
                    }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <div className={styles.subcontainerBehaviour}>
            <div className={`${styles.flexContainerBehaviour} ${styles.fieldBig}`}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <span className={styles.holderContainer}>
                    <img alt={''} className={`${styles.iconHolder} `} src={PsychologyIcon} />
                  </span>
                  <div className={styles.textWithTooltip}>
                    <span className={styles.textHolder}>Agent Behavior</span>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Choose the appropriate agent behavior"
                      withIcon
                      arrow
                      placement={'right'}
                    />
                  </div>
                </div>
              </div>
              <div className={`${styles.field}`}>
                <div className={styles.checkboxContainer}>
                  <FormControlLabel
                    label={'Use context'}
                    sx={{ margin: '0', padding: '0' }}
                    control={
                      <Checkbox
                        sx={{ margin: '0', padding: '0' }}
                        name={'useContext'}
                        checked={useContext}
                        onChange={(e) => {
                          setUseContext(e.target.checked);
                        }}
                      />
                    }
                  />

                  <Tooltip
                    placement={'right'}
                    arrow
                    iconClassName={styles.tooltipIcon}
                    text={t('TemplateBotConfig.tooltipUseContext')}
                    withIcon
                  />
                </div>
                <div className={styles.checkboxContainer}>
                  <FormControlLabel
                    label={'Use history'}
                    sx={{ margin: '0', padding: '0' }}
                    control={
                      <Checkbox
                        sx={{ margin: '0', padding: '0' }}
                        name={'useHistory'}
                        defaultChecked={useHistory}
                        onChange={(e) => {
                          setUseHistory(e.target.checked);
                        }}
                      />
                    }
                  />
                  <Tooltip
                    placement={'right'}
                    arrow
                    iconClassName={styles.tooltipIcon}
                    text={t('TemplateBotConfig.tooltipUseHistory')}
                    withIcon
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.subcontainerPrompt}>
            <div className={`${styles.textAreaContainer} ${styles.fieldBig}`}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <img alt={''} className={`${styles.iconHolder} `} src={IdCardIcon} />
                  <div className={styles.textWithTooltip}>
                    <span className={styles.textHolder}>{t('TemplateBotConfig.mainInstruction')}</span>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text={t('TemplateBotConfig.tooltipPrompt')}
                      withIcon
                      arrow
                      placement={'right'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl
                  sx={{
                    width: '100%',
                    height: '100%',
                    fontSize: 'inherit',
                    '& .MuiFormHelperText-root': {
                      height: '21px',
                    },
                    paddingBottom: touched.prompt && promptText.length === 0 ? '0' : '24px',
                  }}>
                  <StyledTextField
                    id={'greeting'}
                    name={'greeting'}
                    error={touched.prompt && promptText.length === 0}
                    helperText={touched.prompt && promptText.length === 0 ? 'Should be not empty' : ''}
                    variant="outlined"
                    defaultValue={promptText}
                    multiline
                    onChange={changePromptText}
                    InputProps={{
                      style: {
                        color: '#1f1f1f',
                        borderRadius: '10px',
                        height: '100%',
                        fontSize: 'inherit',
                      },
                      sx: {
                        padding: 0,
                        fontSize: 'inherit',
                        '& .MuiInputBase-input': {
                          fontSize: 'inherit',
                          padding: '14px',
                        },
                        '& .MuiOutlinedInput-root': {
                          fontSize: 'inherit',
                          padding: 0,
                        },
                      },
                    }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <TryItNowButton
              label={'Next'}
              style={{ padding: ' 14px 55px', fontSize: '16px', fontWeight: '700' }}
              onClick={handleSubmit}
              disabled={disableButtonRef.current}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
