import cx from 'classnames';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Interaction, InteractionMessage, TimeoutId } from 'types';
import { convertToTimestamp, getTime } from 'utils/primitives/date';
import s from './InteractionPlayer.module.scss';
import { Waveform } from './Waveform/index.ts';
import { mathLeftForLine } from './Waveform/utils.ts';
import { PlayButton } from '../PlayButton/playButton.tsx';
export type InteractionPlayerProps = {
  interaction: Interaction;
  activeMessage?: InteractionMessage;
};

export const InteractionPlayer: FC<InteractionPlayerProps> = ({ interaction, activeMessage }) => {
  const { t } = useTranslation();
  if (interaction.type === 'text_chat') return <></>;

  const [time, setTime] = useState('');
  const waveformsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<TimeoutId | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPlayingToggled, setToggled] = useState(false);

  useEffect(() => {
    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    return stopAudio;
  }, []);

  useEffect(() => {
    setToggled(false);
    if (!audioRef.current || !interaction.uri) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, [activeMessage]);
  useEffect(() => {
    if (!interaction.uri) return;
    audioRef.current = new Audio(interaction.uri);
  }, [interaction.uri]);

  const togglePLay = (isPlay: boolean) => {
    if (!audioRef.current || !interaction.uri) return;
    if (isPlay) {
      audioRef.current.pause();
      setTransitionEnabled(false);
    } else {
      audioRef.current.play();
      setTransitionEnabled(true);
    }

    setIsPlaying(!isPlay);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleAudioEnded);
    return () => {
      if (!audioRef.current) return;
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('ended', handleAudioEnded);
    };
  }, [audioRef.current]);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleLoadedMetadata = () => {
      if (!audioRef.current) return;
      setDuration(audioRef.current.duration);
    };

    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (!audioRef.current) return;
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef.current]);

  useEffect(() => {
    if (interaction.done && interaction.finishTimestamp) {
      timerRef.current && clearTimeout(timerRef.current);
      const d = new Date(
        convertToTimestamp(interaction.finishTimestamp) - convertToTimestamp(interaction.startTimestamp),
      );
      setTime(getTime(d.getTime()));
      return;
    }

    return () => {};
  }, [interaction, timerRef.current]);

  useEffect(() => {
    if (!interaction.done && !interaction.finishTimestamp) {
      startTimer();
    }
  }, []);

  useEffect(() => {
    if (!waveformsRef.current) return;
    waveformsRef.current.scrollLeft = waveformsRef.current.scrollWidth;
  }, [interaction, waveformsRef.current?.scrollWidth]);

  const waveformData = useMemo(() => {
    try {
      return JSON.parse(interaction.audioWaveform);
    } catch {
      return [];
    }
  }, [interaction]);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      const d = new Date(Date.now() - (convertToTimestamp(interaction?.startTimestamp) || Date.now()));
      setTime(getTime(d.getTime()));
      startTimer();
    }, 1000);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const boundingRect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - boundingRect.left;
      const newTime = (clickPosition / boundingRect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <section className={s.player}>
      <span className={s.label}>Interaction Player</span>
      <div className={s.player__waveforms} ref={waveformsRef}>
        <div className={s.player__waveforms_item}>
          <PlayButton
            onClick={() => {
              togglePLay(isPlaying);
              setToggled(true);
            }}
            isPlaying={isPlaying}
          />
          <Waveform
            isPlayingToggled={isPlayingToggled}
            interaction={interaction}
            transitionEnabled={transitionEnabled}
            currentTime={currentTime}
            duration={duration}
            activeMessage={activeMessage}
            waveform={waveformData}
            msInOneChunk={interaction.audioMsInOneChunk || 100}
            time={time}
          />
          <span className={s.player__time}>{time}</span>
        </div>
      </div>
    </section>
  );
};
