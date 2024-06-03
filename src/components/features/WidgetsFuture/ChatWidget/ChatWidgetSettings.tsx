import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';

import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { MuiColorInput } from 'mui-color-input';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { TConfig, TWidgetDesign } from 'types';
import BotIcon from '../../../../assets/svg/botBlack.svg';
import {
  addNotification,
  getchatBotWidgetVisible,
  setConfigBotField,
  useAppDispatch,
  useAppSelector,
} from '../../../../store/index.ts';
import { getDefaultSettingsForChatDialog } from '../../../../utils/template.ts';
import { VisuallyHiddenInput } from '../../ConfigurationPageFeatures/forms/index.ts';
import { ChatPreview } from './ChatPreview/ChatPreview.tsx';
import styles from './ChatWidgetSettings.module.scss';
import PreviewBG from '../../../../assets/svg/Preview.svg';

type TProps = {
  data: TConfig;
};

const defaultSettings = getDefaultSettingsForChatDialog();

export const ChatWidgetSettings = (props: TProps) => {
  const host = document.location.origin;
  const dispatch = useAppDispatch();

  const previewBlock = useRef<HTMLDivElement>(null);
  const widthBlockRef = useRef<HTMLInputElement>(null);
  const heightBlockRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const isChatBotWidgetVisible = useAppSelector(getchatBotWidgetVisible);
  const { bot } = props.data;

  defaultSettings.agentName = bot!.name;

  const widgetSettings = {
    ...defaultSettings,
    ...(bot!.widgetDesign !== '' ? JSON.parse(bot!.widgetDesign as unknown as string) : {}),
  };

  const str = bot!.widgetLogo ? `data:${widgetSettings.logoMimeType};base64,${bot!.widgetLogo}` : BotIcon;
  const [imagePreview, setImagePreview] = useState<string>(str);

  useEffect(() => {
    if (previewBlock.current && widthBlockRef.current && heightBlockRef.current) {
      getMinMaxHeightWidth();
    }
  }, [previewBlock.current, widthBlockRef.current, heightBlockRef.current]);
  const [formState, setFormState] = useState(widgetSettings);
  const [isChangeFormState, setIsChangeFormState] = useState(false);

  const setDefaultDesign = () => {
    setFormState({ ...defaultSettings, logoMimeType: formState.logoMimeType });
    setImagePreview(BotIcon);
    dispatch(setConfigBotField({ field: 'widgetLogo', value: new Blob() }));
  };

  const handleChange = (key: string, value: any) => {
    setFormState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getMinMaxHeightWidth = () => {
    if (heightBlockRef.current) {
      const height = previewBlock!.current!.offsetHeight * 0.975;
      if (height < widgetSettings.height) {
        handleChange('height', height);
        heightBlockRef.current!.value = String(height);
      }
    }

    if (widthBlockRef.current) {
      const width = previewBlock!.current!.offsetWidth * 0.975;
      if (width < widgetSettings.width) {
        handleChange('width', width);
        widthBlockRef.current!.value = String(width);
      }
    }
  };

  useEffect(() => {
    if (!isChangeFormState) {
      setIsChangeFormState(true);
    } else {
      dispatch(setConfigBotField({ field: 'widgetDesign', value: JSON.stringify(formState) }));
    }
  }, [formState]);

  useEffect(() => {
    if (!image) return;
    const reader = new FileReader();

    reader.readAsArrayBuffer(image as Blob);
    reader.onload = async (e) => {
      if (!e.target?.result) return;
      const blob = new Blob([e?.target?.result], {
        type: image!.type, // Тип изображения
      });
      handleChange('logoMimeType', image!.type);
      dispatch(setConfigBotField({ field: 'widgetLogo', value: blob }));
    };
  }, [image]);

  const handleImageChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file.size > 50 * 1024) {
      dispatch(
        addNotification({
          message: '',
          type: 'error',
          title: 'Logo must be < 50kb',
        }),
      );
      return;
    }
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getColorElement = (label: string, value: string, handle: Dispatch<SetStateAction<string>>) => {
    return (
      <div className={styles.mt10}>
        <div className={styles.colorPicketBlock}>
          <p className={styles.label}>{label}</p>
          <MuiColorInput
            isAlphaHidden={false}
            adornmentPosition={'start'}
            format="rgb"
            value={value}
            onChange={(v) => handle(v)}
          />
        </div>
      </div>
    );
  };

  const sliderElement = (
    title: string,
    value: number,
    setValue: Dispatch<SetStateAction<number>>,
    min: number,
    max: number,
    suffix?: string,
  ) => {
    return (
      <div style={{ width: '300px' }}>
        <p className={styles.label}>{title}</p>
        <div style={{ paddingLeft: '5px', display: 'flex', gap: '20px' }}>
          <div className={styles.sliderBlock}>
            <Slider
              value={value}
              onChange={(_event: Event, newValue: number | number[]) => setValue(newValue as number)}
              aria-labelledby="input-slider"
              min={min}
              max={max}
              sx={{ color: 'rgba(0,0,0,0.87)' }}
              size={'small'}
            />
          </div>
          <span className={styles.sliderCount}>
            {value}
            {suffix || ''}
          </span>
        </div>
      </div>
    );
  };

  const getRef = (k: string) => {
    if (k === 'width') return widthBlockRef;
    if (k === 'height') return heightBlockRef;
    return null;
  };

  type NumberFieldType = { title: string; value: string; key: string; min?: number; max?: number };
  const getSmallTextField = ({ title, value, key }: NumberFieldType, setValue: Dispatch<SetStateAction<number>>) => {
    return (
      <div className={styles.checkBoxBlock}>
        <p className={styles.label}>{title}</p>
        <TextField
          sx={{ width: '100px' }}
          defaultValue={value}
          onBlur={(v) => {
            const val = v.target.value.toString();
            if (val === '' || val.startsWith('-') || val === '0' || val === '') {
              v.target.value = widgetSettings[key as keyof TWidgetDesign].toString();
            } else if (key === 'height') {
              const height = previewBlock!.current!.offsetHeight * 0.975;
              if (Number(val) > height) v.target.value = height.toString();
            } else if (key === 'width') {
              const width = previewBlock!.current!.offsetWidth * 0.975;
              if (Number(val) > width) v.target.value = width.toString();
            }
            setValue(Number(v.target.value));
          }}
          onKeyDown={(ev) => {
            if (ev.key === '-') ev.preventDefault();
            if (ev.key === 'Enter') (ev.target as HTMLInputElement).blur();
          }}
          InputProps={{
            endAdornment: <span>px</span>,
            inputProps: {
              min: 1,
            },
          }}
          inputRef={getRef(key)}
          type={'number'}
        />
      </div>
    );
  };

  const getWidgetPosition = () => {
    return (
      <div>
        <p className={styles.label}>Widget Position</p>
        <div className={`${styles.flexRow} ${styles.mt10}`}>
          <ToggleButtonGroup
            color="primary"
            value={formState.widgetPosition}
            exclusive
            onChange={(event, value) => handleChange('widgetPosition', value)}
            aria-label="Platform">
            <ToggleButton value="leftBottom">Left Bottom</ToggleButton>
            <ToggleButton value="rightBottom">Right Bottom</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={`${styles.flexRow} ${styles.mt15}`}>
          {getSmallTextField(
            {
              title: 'Vertical Margin',
              value: formState.verticalMargin,
              key: 'verticalMargin',
              min: 1,
              max: 500,
            },
            (value) => handleChange('verticalMargin', value),
          )}
          {getSmallTextField(
            {
              title: 'Horizontal Margin',
              value: formState.horizontalMargin,
              key: 'horizontalMargin',
              min: 1,
              max: 500,
            },
            (value) => handleChange('horizontalMargin', value),
          )}
        </div>
      </div>
    );
  };

  const getWidgetSize = () => {
    return (
      <div>
        {/*<p className={styles.boldLabel}>Widget Size</p>*/}
        <div className={`${styles.flexRow} ${styles.mt10}`}>
          {getSmallTextField(
            {
              title: 'Width',
              value: formState.width,
              key: 'width',
              min: 200,
              max: 800,
            },
            (value) => handleChange('width', value),
          )}
          {getSmallTextField(
            {
              title: 'Height',
              value: formState.height,
              key: 'height',
              min: 300,
              max: 800,
            },
            (value) => handleChange('height', value),
          )}
        </div>
      </div>
    );
  };

  const TextFieldFull = (
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    placeholder: string,
    disabled: boolean,
  ) => {
    return (
      <div className={`${styles.textFieldBlock}`}>
        <TextField
          fullWidth={true}
          placeholder={placeholder}
          value={value}
          onChange={(v) => setValue(v.target.value)}
          disabled={disabled}
        />
      </div>
    );
  };

  const getFonts = () => (
    <div>
      <p className={styles.boldLabel}>Fonts</p>
      {sliderElement('Font Size', formState.fontSize, (value) => handleChange('fontSize', value), 8, 32, 'px')}
    </div>
  );

  const getWidgetTitle = () => {
    return (
      <div>
        <p className={styles.label}>Widget Title</p>
        {/*{getCheckbox("Use Agent's name", formState.useAgentName, (value) => handleChange('useAgentName', value))}*/}
        {TextFieldFull(formState.agentName, (value) => handleChange('agentName', value), 'Enter title', false)}
      </div>
    );
  };

  const getInput = () => {
    return (
      <div>
        <p className={styles.boldLabel}>Input</p>
        <p className={styles.label} style={{ marginTop: '15px' }}>
          Text Placeholder
        </p>
        {TextFieldFull(
          formState.inputPlaceholder,
          (value) => handleChange('inputPlaceholder', value),
          'Enter placeholder',
          false,
        )}
      </div>
    );
  };

  const getCheckbox = (title: string, value: boolean, setValue: Dispatch<SetStateAction<boolean>>) => {
    return (
      <div className={styles.checkBoxBlock}>
        <FormControlLabel
          control={<Checkbox checked={value} onChange={(v) => setValue(v.target.checked)} color={'default'} />}
          label={title}
        />
      </div>
    );
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        dispatch(
          addNotification({
            message: '',
            type: 'success',
            title: 'Script copied to clipboard',
          }),
        );
      })
      .catch((error) => {
        dispatch(
          addNotification({
            message: '',
            type: 'error',
            title: "Script wasn't copied to clipboard",
          }),
        );
        console.error('Failed to copy code: ', error);
      });
  };

  const code = `<script>
    (function(d, w) {
        w.resolveBotId = '${props.data.bot?.id}';
        var s = d.createElement('script');
        s.async = true;
        s.type = 'module';
        s.src = '${host}/widget/chat.js';
        if (d.head) d.head.appendChild(s);
    })(document, window);
</script>`;
  return (
    <>
      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '20px',
          // flexDirection: formState.widgetPosition === 'leftBottom' ? 'row-reverse' : 'row',
        }}>
        <div
          className={styles.subwrapper}
          style={{ paddingBottom: '10px', paddingTop: '20px', width: 'min-content', paddingRight: '20px' }}>
          <div
            className={styles.hader}
            style={{
              display: 'flex',
              flexDirection: 'column',
              // paddingTop: '10px',
              paddingLeft: '20px',
              gap: '10px',
              flexGrow: 1,
            }}>
            <Divider orientation="horizontal" flexItem>
              Logo
            </Divider>
            <div style={{ display: 'flex', gap: '20px' }}>
              <img src={imagePreview} alt="Preview" style={{ width: 100, height: 100 }} />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1f1f1f',
                  border: '1px solid #1f1f1f',
                  fontSize: '12px',
                  width: '100%',
                  alignSelf: 'center',
                }}
                startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  name="file"
                  required={false}
                  accept=".JPG,.jpeg,.png,.svg"
                  onChange={handleImageChange}
                />
              </Button>
            </div>

            <Divider orientation="horizontal" flexItem>
              Widget Settings
            </Divider>
            {<div className={styles.mt10}>{getWidgetPosition()}</div>}
            {<div className={styles.mt10}>{getWidgetSize()}</div>}
            {sliderElement(
              'Round Corners',
              formState.widgetRoundCorners,
              (value) => handleChange('widgetRoundCorners', value),
              0,
              30,
              'px',
            )}

            <Divider orientation="horizontal" flexItem>
              Header Settings
            </Divider>
            {getColorElement('Header Background', formState.headerColor, (value) => handleChange('headerColor', value))}
            {getColorElement('Header Text Color', formState.headerColorText, (value) =>
              handleChange('headerColorText', value),
            )}
            {getColorElement('Close Button Color', formState.closeButtonColor, (value) =>
              handleChange('closeButtonColor', value),
            )}
            {sliderElement(
              'Title Font Size',
              formState.titleFontSize,
              (value) => handleChange('titleFontSize', value),
              8,
              32,
              'px',
            )}

            {<div className={styles.mt10}>{getWidgetTitle()}</div>}

            <Divider orientation="horizontal" flexItem>
              Dialog setting
            </Divider>

            {getColorElement('Background color', formState.backgroundColor, (value) =>
              handleChange('backgroundColor', value),
            )}

            {<div className={styles.mt10}>{getFonts()}</div>}

            <p className={`${styles.boldLabel} ${styles.mt10}`}>Message Color</p>
            {<div className={styles.mt10}></div>}
            {getColorElement('Agent Message Background Color', formState.agentMessageBackgroundColor, (value) =>
              handleChange('agentMessageBackgroundColor', value),
            )}
            {getColorElement('Agent Message Text Color', formState.agentMessageTextColor, (value) =>
              handleChange('agentMessageTextColor', value),
            )}
            {<div className={styles.mt10}></div>}
            {getColorElement('User Message Background Color', formState.userMessageBackgroundColor, (value) =>
              handleChange('userMessageBackgroundColor', value),
            )}
            {getColorElement('User Message Text Color', formState.userMessageTextColor, (value) =>
              handleChange('userMessageTextColor', value),
            )}

            <Divider orientation="horizontal" flexItem>
              Input settings
            </Divider>
            {<div className={styles.mt10}>{getInput()}</div>}
            {
              <div className={styles.mt10}>
                {getColorElement('Input Background Color', formState.inputBackgroundColor, (value) =>
                  handleChange('inputBackgroundColor', value),
                )}
                {getColorElement('Input Text Color', formState.inputTextColor, (value) =>
                  handleChange('inputTextColor', value),
                )}
              </div>
            }

            <Divider orientation="horizontal" flexItem>
              Send Button settings
            </Divider>
            <p className={`${styles.boldLabel} ${styles.mt10}`}></p>
            {<div className={styles.mt10}></div>}
            {getColorElement('Button Background Color', formState.buttonBackgroundColor, (value) =>
              handleChange('buttonBackgroundColor', value),
            )}
            {getColorElement('Button Text Color', formState.buttonTextColor, (value) =>
              handleChange('buttonTextColor', value),
            )}
            {sliderElement(
              'Round Corners',
              formState.sendButtonRoundCorner,
              (value) => handleChange('sendButtonRoundCorner', value),
              0,
              30,
              'px',
            )}
            {getCheckbox('Shadow', formState.shadow, (value) => handleChange('shadow', value))}

            <Button onClick={setDefaultDesign}>Reset Design</Button>

            <TextField style={{ width: '500px' }} disabled={true} multiline rows={9} variant="outlined" value={code} />
            <Button onClick={handleCopyClick} variant="contained" sx={{ mt: 2 }}>
              Copy
            </Button>
          </div>
        </div>
        <div
          ref={previewBlock}
          className={styles.previewBlock}
          style={{
            flex: '1',
            backgroundImage: `url(${PreviewBG})`,
            justifyContent: formState.widgetPosition === 'leftBottom' ? 'start' : 'end',
            padding: 15,
          }}>
          {!isChatBotWidgetVisible && <ChatPreview data={formState} image={imagePreview} />}
        </div>
      </div>
    </>
  );
};
