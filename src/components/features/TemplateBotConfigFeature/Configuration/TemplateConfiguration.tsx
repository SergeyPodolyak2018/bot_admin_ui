import { styled } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import cx from 'classnames';
import { Checkbox, Loader, Tooltip } from 'components/common';
import {
  CustomDropDownIcon,
  CustomDropDownIconWithClose,
} from 'components/common/CustomDropDownIcon/CustomDropDownIcon';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPurchasedPhoneNumbersByOrgId } from 'services';
import {
  addNotification,
  changeBotPhone,
  changeBotPromptText,
  decLoaderCountAction,
  getConfig,
  getConfigOrganizationId,
  incLoaderCountAction,
  selectExpertMode,
  selectOrganisationsState,
  setConfigBotField,
  setConfigBotOrgId,
  useAppDispatch,
  useAppSelector,
  changeBotModel,
  setConfigBotModelId,
} from 'store';
import { ClassNames, PhoneNumber, TConfig } from 'types';
import IdCardIcon from '../../../../assets/svg/IdCardIcon.svg';
import OrganizationIcon from '../../../../assets/svg/OrganizationIcon.svg';
import PhoneNumberIcon from '../../../../assets/svg/PhoneNumber.svg';
import PsychologyIcon from '../../../../assets/svg/PsychologyIcon.svg';
import HandIcon from '../../../../assets/svg/WavingHeadIcon.svg';
import KeyIcon from '../../../../assets/svg/Key.svg';
import ModelIcon from '../../../../assets/svg/Circuitry.svg';
import styles from './templateConfiguration.module.scss';
import { getModelsInfo } from 'services/api/models/models.service';
import { selectModels, setModels } from 'store/models';
import { GetModelsResponse } from 'services/api/models/models.types';

type TProps = {
  data: TConfig;
  classNames?: ClassNames;
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

export const TemplateConfiguration = (props: TProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isExpertMode = useAppSelector(selectExpertMode);
  const organisations = useAppSelector(selectOrganisationsState);
  const config = useAppSelector(getConfig);
  const selectedConfigOrgId = useAppSelector(getConfigOrganizationId);
  const models = useAppSelector(selectModels);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(props.data.bot?.phone || '');
  const [selectedModel, setSelectedModel] = useState(props.data.bot?.llmModelId || '');

  const changePhoneNumber = (value: string) => {
    dispatch(changeBotPhone(value));
    setSelectedPhoneNumber(value);
    const phone = phoneNumbers.find((ph) => ph.phoneNumber === value);
    if (!phone) return;
    if (phone.botId && phone.botId !== config?.bot?.recordId) {
      dispatch(
        addNotification({
          title: 'Warning',
          message: `This phone is using by ${phone.bot?.name} `,
          type: 'warning',
        }),
      );
    }
    setSelectedPhoneNumber(value);
  };

  // const changeModel = (value: string) => {
  //   dispatch(changeBotModel(value));
  //   setSelectedModel(value);
  // };

  useEffect(() => {
    getModelsInfo().then((data) => dispatch(setModels(data.data)));
  }, []);

  useEffect(() => {
    if (selectedConfigOrgId) {
      dispatch(incLoaderCountAction());
      setSelectedPhoneNumber('');
      getPurchasedPhoneNumbersByOrgId(selectedConfigOrgId)
        .then((r) => {
          r.data.forEach((x) => {
            if (x.phoneNumber === config.phone) {
              setSelectedPhoneNumber(x.phoneNumber);
            }
            const data = r.data.filter((x) => !x.botId || x.botId === config.bot!.recordId);
            setPhoneNumbers(data);
          });
        })
        .finally(() => {
          dispatch(decLoaderCountAction());
        });
    }
  }, [selectedConfigOrgId]);

  const changefield = (name: string, val: any) => {
    dispatch(setConfigBotField({ field: name, value: val }));
  };
  const changeSelect = (event: SelectChangeEvent<string>) => {
    dispatch(setConfigBotOrgId(Number(event.target.value)));
  };
  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    changefield('name', event.target.value);
  };
  const changeGreeting = (event: ChangeEvent<HTMLInputElement>) => {
    changefield('greeting', event.target.value);
  };
  const changeModel = (event: SelectChangeEvent<string>) => {
    const modelId = models.find((x) => x.name === event.target.value)?.id;
    if (modelId) dispatch(setConfigBotModelId(modelId));
  };
  const changePromptText = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeBotPromptText(event.target.value));
  };
  if (!props.data.bot) return <Loader type={'full-page'} />;
  return (
    <div className={cx(styles.container, props.classNames)}>
      <div className={styles.sectionsWrapper}>
        <div className={styles.subwrapper}>
          <div className={styles.subcontainer}>
            <div className={styles.fieldContainer}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <div className={styles.holderContainer}>
                    <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={OrganizationIcon} />
                  </div>

                  <div className={styles.textWithTooltip}>
                    <div className={styles.textHolder}>Organization</div>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Select the organization to which the agent will belong"
                      withIcon
                      arrow
                      placement={'bottom'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', fontFamily: 'inherit' }}>
                  <Select
                    IconComponent={CustomDropDownIcon}
                    sx={{
                      borderRadius: '10px',
                      color: '#1f1f1f',

                      '& .MuiSelect-select': {
                        padding: '14px',
                        paddingTop: '17px',
                        paddingBottom: '13px',
                      },
                    }}
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
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="organizationId"
                    value={String(props.data.bot?.organization.id)}
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
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <div className={styles.holderContainer}>
                    <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={IdCardIcon} />
                  </div>
                  <div className={styles.textWithTooltip}>
                    <div className={styles.textHolder}>Agent Name</div>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Please indicate what your agent should be called"
                      withIcon
                      arrow
                      placement={'bottom'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl
                  sx={{
                    width: '100%',
                    '& .MuiFormHelperText-root': {
                      height: '21px',
                    },
                  }}>
                  <TextField
                    style={{ borderRadius: '10px', color: '#1f1f1f' }}
                    id={'name'}
                    name={'name'}
                    placeholder={"Enter Your Bot's Name"}
                    variant="outlined"
                    value={props.data.bot.name}
                    error={props.data.bot.name.length === 0}
                    helperText={props.data.bot.name.length === 0 ? 'Should be not empty' : ''}
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
                        },
                      },
                    }}
                  />
                </FormControl>
              </div>
            </div>
            <div className={styles.fieldContainer}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <div className={styles.holderContainer}>
                    <img alt={''} className={`${styles.iconHolder} `} src={HandIcon} />
                  </div>
                  <div className={styles.textWithTooltip}>
                    <div className={`${styles.textHolder} ${styles.textFlex}`}>Welcome Message</div>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Add a welcome message with which the agent will contact the user"
                      withIcon
                      arrow
                      placement={'bottom'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl
                  sx={{
                    width: '100%',
                    '& .MuiFormHelperText-root': {
                      height: '21px',
                    },
                  }}>
                  <TextField
                    style={{ borderRadius: '10px', color: '#1f1f1f' }}
                    id={'greeting'}
                    name={'greeting'}
                    placeholder={'Enter Welcome Message'}
                    variant="outlined"
                    value={props.data.bot?.greeting}
                    onChange={changeGreeting}
                    multiline={false}
                    type={'text'}
                    error={props.data.bot?.greeting.length < 20}
                    helperText={props.data.bot?.greeting.length < 20 ? 'Min length 20 symbols' : ''}
                    InputProps={{
                      style: {
                        borderRadius: '10px',
                        width: '100%',
                      },
                      sx: {
                        '& .MuiInputBase-input': {
                          minWidth: 'calc(100% - 30px)',
                          padding: '14px',
                        },
                      },
                    }}
                  />
                </FormControl>
              </div>
            </div>
            <div className={styles.fieldContainer}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <div className={styles.holderContainer}>
                    <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={PhoneNumberIcon} />
                  </div>
                  <div className={styles.textWithTooltip}>
                    <div className={styles.textHolder}>Phone Number</div>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Assign specific phone number to your AI agent"
                      withIcon
                      arrow
                      placement={'bottom'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', fontFamily: 'inherit' }}>
                  <Select
                    IconComponent={
                      selectedPhoneNumber
                        ? () => CustomDropDownIconWithClose({ onClickClose: () => changePhoneNumber('') })
                        : CustomDropDownIcon
                    }
                    sx={{
                      borderRadius: '10px',
                      color: '#1f1f1f',

                      '& .MuiSelect-select': {
                        padding: '14px',
                        paddingTop: '17px',
                        paddingBottom: '13px',
                      },
                    }}
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
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="phoneNumber"
                    disabled={phoneNumbers.length === 0}
                    displayEmpty
                    placeholder={'Select phone number'}
                    value={selectedPhoneNumber}
                    renderValue={() => {
                      if (selectedPhoneNumber) {
                        return selectedPhoneNumber;
                      }
                      return phoneNumbers.length === 0 ? 'No phone numbers available' : 'Assign phone number';
                    }}
                    onChange={(e) => changePhoneNumber(e.target.value)}>
                    {phoneNumbers.map((el) => (
                      <MenuItem
                        sx={{
                          padding: '7px',
                          margin: '7px',
                          borderRadius: '5px',
                        }}
                        value={el.phoneNumber}
                        key={el.phoneNumber}>
                        {el.phoneNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className={styles.subcontainerBottom}>
            <div className={styles.fieldContainer}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <div className={styles.holderContainer}>
                    <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={ModelIcon} />
                  </div>

                  <div className={styles.textWithTooltip}>
                    <div className={styles.textHolder}>Large Language Model</div>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Choose specific LLM for AI agent"
                      withIcon
                      arrow
                      placement={'bottom'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', fontFamily: 'inherit' }}>
                  <Select
                    IconComponent={CustomDropDownIcon}
                    sx={{
                      borderRadius: '10px',
                      color: '#1f1f1f',

                      '& .MuiSelect-select': {
                        padding: '14px',
                        paddingTop: '17px',
                        paddingBottom: '13px',
                      },
                    }}
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
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="organizationId"
                    value={models.find((x) => x.id === props.data.bot?.llmModelId)?.name}
                    displayEmpty
                    renderValue={() => {
                      const currentModel = models.find((x) => x.id === props.data.bot?.llmModelId)?.name;
                      if (currentModel) {
                        return currentModel;
                      }

                      return 'Choose LLM';
                    }}
                    onChange={changeModel}>
                    {models?.map((el) => (
                      <MenuItem
                        key={el.id}
                        value={el.name}
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
            {/* <div className={styles.fieldContainer}>
              <div className={styles.flexContainer}>
                <div className={styles.hader}>
                  <div className={styles.holderContainer}>
                    <img alt={''} className={`${styles.textHolder} ${styles.textFlex}`} src={KeyIcon} />
                  </div>

                  <div className={styles.textWithTooltip}>
                    <div className={styles.textHolder}>Keys</div>
                    <Tooltip
                      iconClassName={styles.tooltipIcon}
                      text="Select the organization to which the agent will belong"
                      withIcon
                      arrow
                      placement={'bottom'}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', fontFamily: 'inherit' }}>
                  <Select
                    IconComponent={CustomDropDownIcon}
                    sx={{
                      borderRadius: '10px',
                      color: '#1f1f1f',

                      '& .MuiSelect-select': {
                        padding: '14px',
                        paddingTop: '17px',
                        paddingBottom: '13px',
                      },
                    }}
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
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="organizationId"
                    renderValue={() => {
                      if (selectedModel) {
                        return selectedModel;
                      }

                      return 'Choose Key';
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
            </div> */}
          </div>
        </div>

        <div className={styles.subcontainer}></div>
        <div className={styles.subcontainerBehaviour}>
          <div className={`${styles.flexContainerBehaviour} ${styles.fieldBig}`}>
            <div className={styles.flexContainer}>
              <div className={styles.hader}>
                <div className={styles.holderContainer}>
                  <img alt={''} className={`${styles.iconHolder} `} src={PsychologyIcon} />
                </div>
                <div className={styles.textWithTooltip}>
                  <div className={`${styles.textHolder} ${styles.textFlex}`}>Agent Behavior</div>
                  <Tooltip
                    arrow
                    placement={'bottom'}
                    iconClassName={styles.tooltipIcon}
                    text="Choose the appropriate agent behavior"
                    withIcon
                  />
                </div>
              </div>
            </div>
            <div className={`${styles.field}`}>
              {isExpertMode && (
                <div className={styles.checkboxContainer}>
                  <FormControlLabel
                    sx={{ margin: 0 }}
                    label={'Use context'}
                    control={
                      <Checkbox
                        sx={{ padding: 0, margin: 0 }}
                        name={'useContext'}
                        checked={props.data.bot?.useContext}
                        onChange={(e) => {
                          changefield('useContext', e.target.checked);
                        }}
                      />
                    }
                  />

                  <Tooltip
                    placement={'bottom'}
                    arrow
                    iconClassName={styles.tooltipIcon}
                    text={t('TemplateBotConfig.tooltipUseContext')}
                    withIcon
                  />
                </div>
              )}

              <div className={styles.checkboxContainer}>
                <FormControlLabel
                  sx={{ margin: 0 }}
                  label={isExpertMode ? 'Use previous searches' : 'Use history'}
                  control={
                    <Checkbox
                      sx={{ padding: 0, margin: 0 }}
                      name={'useHistory'}
                      defaultChecked={props.data.bot?.useHistory}
                      onChange={(e) => {
                        changefield('useHistory', e.target.checked);
                        if (!isExpertMode) {
                          changefield('useContext', e.target.checked);
                        }
                      }}
                    />
                  }
                />
                <Tooltip
                  placement={'bottom'}
                  arrow
                  iconClassName={styles.tooltipIcon}
                  text={
                    isExpertMode
                      ? t('TemplateBotConfig.tooltipUsePrevSearches')
                      : t('TemplateBotConfig.tooltipUseHistory')
                  }
                  withIcon
                />
              </div>
              {/* <div className={styles.checkboxContainer}>
                <FormControlLabel
                  sx={{ mr: '2px' }}
                  label={'Use remarks'}
                  control={
                    <Checkbox
                      name={'useRemarks'}
                      defaultChecked={props.data.bot?.useRemarks}
                      onChange={(e) => {
                        changefield('useRemarks', e.target.checked);
                      }}
                    />
                  }
                />
                <Tooltip iconClassName={styles.tooltipIcon} text={t('TemplateBotConfig.tooltipUseRemarks')} withIcon />
              </div> */}
            </div>
          </div>
        </div>
        <div className={styles.subcontainerPrompt}>
          <div className={`${styles.textAreaContainer} ${styles.fieldBig}`}>
            <div className={styles.flexContainer}>
              <div className={styles.hader}>
                <div className={styles.holderContainer}>
                  <img alt={''} className={`${styles.iconHolder} `} src={IdCardIcon} />
                </div>
                <div className={styles.textWithTooltip}>
                  <div className={`${styles.textHolder} ${styles.textFlex}`}>Main Instruction</div>
                  <Tooltip
                    iconClassName={styles.tooltipIcon}
                    text="Short description of AI Agent's general behavior"
                    withIcon
                    arrow
                    placement={'bottom'}
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
                    height: '19px',
                  },
                }}>
                <StyledTextField
                  id={'greeting'}
                  name={'greeting'}
                  variant="outlined"
                  defaultValue={props.data.bot?.botPrompt}
                  error={props.data.bot?.botPrompt.length === 0}
                  helperText={props.data.bot?.botPrompt.length === 0 ? 'Should be not empty' : ''}
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
      </div>
    </div>
  );
};
