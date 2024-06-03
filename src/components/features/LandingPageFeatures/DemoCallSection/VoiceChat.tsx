import CircularProgress from '@mui/material/CircularProgress';
import { ButtonWithMenuItems } from 'components/common/ButtonWithMenuItems/ButtonWithMenuItems.tsx';
import { useVoiceChat } from 'components/features/LandingPageFeatures/DemoCallSection/useVoiceChat.ts';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CallSound from '../../../../assets/audio/phoneBeepSound.mp3';
import styles from './voiceChat.module.scss';
import { getchatBotWidgetHidden, setChatBotWidgetHidden, useAppDispatch, useAppSelector } from '../../../../store';

interface VoiceChatProps {
  botId: string | number;
  callBack: () => void;
  isLoading: boolean;
  chatIsOpened: boolean;
  blocker: boolean;
  skipBlock: boolean;
  blockerCallback: (type: 'chat' | 'voice') => void;
  resetSkip: () => void;
  voiceStart: boolean;
  resetVoice: () => void;
  defaultButtonStyle?: boolean;
  disabled?: boolean;
}

export const VoiceChat: FC<VoiceChatProps> = (props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [chatBotIsRunning, setChatBotState] = useState(false);
  const [voiceBotIsRunning, setVoiceBotState] = useState(false);
  const isChatBotWidgetHidden = useAppSelector(getchatBotWidgetHidden);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('isChatBotWidgetHidden', isChatBotWidgetHidden);
  }, [isChatBotWidgetHidden]);

  const { stopChat, startChat, dialingAudio } = useVoiceChat({
    botId: props.botId,
    onCallStop: () => {
      setVoiceBotState(false);
    },
  });

  useEffect(() => {
    let intervalId: any;
    if (voiceBotIsRunning) {
      intervalId = setInterval(() => {
        if (seconds === 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          setSeconds(0);
        } else {
          setSeconds((prevSeconds) => prevSeconds + 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [voiceBotIsRunning, seconds]);

  const resetTimer = () => {
    setMinutes(0);
    setSeconds(0);
  };

  const menuItems = [
    {
      label: t('landingPageFeatures.DemoCallSection.chat'),
      onClick: () => {
        if (!props.blocker || props.skipBlock) {
          setChatBotState(true);
          props.callBack();
        } else {
          props.blockerCallback('chat');
        }
      },
    },
    {
      label: t('landingPageFeatures.DemoCallSection.webCall'),
      onClick: () => {
        if (!props.blocker || props.skipBlock) {
          setVoiceBotState(true);
          handleStartButtonClick();
        } else {
          props.blockerCallback('voice');
        }
      },
    },
  ];

  const handleStartButtonClick = () => {
    startChat();
  };
  const handleClickStopBtn = () => {
    // vad.terminate();
    // stopRecording();
    stopChat();
    props.resetSkip();
    props.resetVoice();
  };

  useEffect(() => {
    if (!props.chatIsOpened) {
      setChatBotState(false);
    } else {
      setChatBotState(true);
    }
  }, [props.chatIsOpened]);

  useEffect(() => {
    if (props.voiceStart) {
      setVoiceBotState(true);
      handleStartButtonClick();
    }
  }, [props.voiceStart]);

  const getLabel = () => {
    if (isChatBotWidgetHidden && chatBotIsRunning) return t('landingPageFeatures.DemoCallSection.openBot');
    else if (chatBotIsRunning || voiceBotIsRunning) return t('landingPageFeatures.DemoCallSection.stopBot');
    else return t('landingPageFeatures.DemoCallSection.startBot');
  };
  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {<audio loop={true} ref={dialingAudio} controls={false} src={CallSound} preload={'auto'} />}
      {voiceBotIsRunning && (
        <div className={styles.timerContainer}>
          <span className={styles.timer}>{`${minutes < 10 ? '0' : ''}${minutes}:${
            seconds < 10 ? '0' : ''
          }${seconds}`}</span>
        </div>
      )}

      <ButtonWithMenuItems
        onClick={() => {
          if (isChatBotWidgetHidden && chatBotIsRunning) {
            dispatch(setChatBotWidgetHidden(false));
            return;
          }
          if (chatBotIsRunning) {
            props.callBack();
            setChatBotState(false);
            props.resetSkip();
            return;
          } else if (voiceBotIsRunning) {
            handleClickStopBtn();
            setVoiceBotState(false);
            resetTimer();
            props.resetVoice();
            props.resetSkip();
            return;
          }
          // setDropDownState(!dropDownIsOpen);
        }}
        isHidden={isChatBotWidgetHidden}
        isRunning={chatBotIsRunning || voiceBotIsRunning}
        label={getLabel()}
        style={{
          padding: '18px, 32px, 18px, 32px',
          height: '100%',
        }}
        defaultButtonStyle={props.defaultButtonStyle}
        menuItems={menuItems}
        disabled={props.disabled}
      />

      {props.isLoading && (
        <span className={styles.progress}>
          <CircularProgress style={{ width: '20px', height: '20px' }} />
        </span>
      )}
    </div>
  );
};
