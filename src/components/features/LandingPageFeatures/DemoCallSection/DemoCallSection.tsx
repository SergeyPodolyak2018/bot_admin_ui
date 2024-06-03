import { useVoiceChat } from 'components/features/LandingPageFeatures/DemoCallSection/useVoiceChat.ts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DEMO_STATUS } from 'services/api';
import { getDemoBots } from 'services/api/demo';
import { DemoBot } from 'types';
import { useSocket } from 'utils/hooks/useSocket.ts';
import CallSound from '../../../../assets/audio/phoneBeepSound.mp3';
import { Button } from '../Button/Button.tsx';
import { AudioWaveComponent } from './AudioWaveComponent/AudioWaveComponent.tsx';
import { CallButton } from './CallButton/CallButton.tsx';
import { CallStatuses } from './CallStatuses/CallStatuses.tsx';
import { statusOptions } from './constants.ts';
import styles from './demoCall.module.scss';

export const DemoCallSection = () => {
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState(0);
  const [currentDemoCallStatus, setDemoCallStatus] = useState(statusOptions.RESTORING);
  const [bots, setBots] = useState<DemoBot[]>([]);

  const { statuses, botWaveform, stopChat, startChat, dialingAudio, isCalling, isConnecting, isPlaying } = useVoiceChat(
    {
      botId: selectedId,
    },
  );

  const { retryConnect } = useSocket({
    url: DEMO_STATUS,
    initOnLoad: true,
    onMessage: (msg: any) => {
      const data = JSON.parse(msg.data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setDemoCallStatus(statusOptions[data.status]);
    },
    onError: () => {},
    onClose: () => {
      setTimeout(() => {
        retryConnect();
      }, 10000);
    },
  });

  useEffect(() => {
    getDemoBots().then((r) => {
      setBots(r.data);
      setSelectedId(r.data[0].botId);
    });
  }, []);

  const handleStartButtonClick = () => {
    startChat();
  };
  const handleClickStopBtn = () => {
    stopChat();
  };
  const handleChangeBot = (id: number) => {
    setSelectedId(id);
  };
  return (
    <section className={`${styles.section} stop-point-end`} id={'democall'}>
      {/*<button onClick={audioPlay}>play</button>*/}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {<audio loop={true} ref={dialingAudio} controls={false} src={CallSound} preload={'auto'} />}
      <h5 className={styles.section__title}>{t('landingPageFeatures.DemoCallSection.sectionTitle')}</h5>
      <div
        className={`${styles.container}`}
        id={'demoSectionContainer'}
        style={{ borderColor: currentDemoCallStatus.color }}>
        <div className={styles.content}>
          <div className={styles.titleHolder}>
            <div className={styles.demoCallStatus}>
              <div className={`${styles.item}`} style={{ backgroundColor: currentDemoCallStatus.color }}></div>
              <span>{currentDemoCallStatus.text}</span>
            </div>
            <p className={styles.title}>{t('landingPageFeatures.DemoCallSection.sectionTitle')}</p>
            <div className={styles.chooseCategoryWrapper}>
              <p className={styles.categoryLabel}>{t('landingPageFeatures.DemoCallSection.categoryLable')}</p>
              <div className={styles.categories}>
                {bots.map((bot) => (
                  <Button
                    key={bot.botId}
                    disabled={isCalling && selectedId !== bot.botId}
                    // style={{
                    //   width: 'fit-content',
                    //   padding: '12px 20px 12px 20px',
                    //   height: '43px',
                    //   fontSize: '16px',
                    // }}
                    className={styles.categories__button}
                    label={bot.displayName}
                    selected={selectedId === bot.botId}
                    onClick={() => {
                      handleChangeBot(bot.botId);
                    }}
                  />
                ))}
              </div>
              <div className={styles.imageHolder}>
                <div className={styles.emptyArea}>
                  <CallStatuses statuses={statuses} chatId={selectedId} />
                </div>
                <div className={styles.audioHolder}>
                  <AudioWaveComponent
                    isCalling={isCalling}
                    isConnecting={isConnecting}
                    botWaveformData={isCalling && isPlaying ? botWaveform : null}
                  />
                  <CallButton
                    style={{
                      padding: '18px, 32px, 18px, 32px',
                      fontSize: '18px',
                      fontWeight: '700',
                      zIndex: '999',
                    }}
                    onClick={() => {
                      if (isCalling || isConnecting) {
                        handleClickStopBtn();
                      } else {
                        handleStartButtonClick();
                      }
                    }}
                    finish={isCalling || isConnecting}
                    label={isCalling || isConnecting ? 'FINISH CALL' : 'CALL'}
                  />
                </div>
                <div className={styles.buttonHolder}></div>
              </div>
              <p className={styles.label}>
                {isConnecting
                  ? t('landingPageFeatures.DemoCallSection.connecting')
                  : isCalling
                    ? t('landingPageFeatures.DemoCallSection.stopLiveDemonstration')
                    : t('landingPageFeatures.DemoCallSection.startLiveDemonstration')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
