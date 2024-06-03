import { Skeleton as SkeletonBase, SkeletonOwnProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import UserIcon from 'assets/svg/user.svg?react';
import classNames from 'classnames/bind';
import { Span, Tooltip } from 'components/common';
import parse from 'html-react-parser';
import { FC, useEffect, useRef, useState } from 'react';
import { InteractionMessage } from 'types';
import { convertToTimestamp, getTime } from 'utils/primitives/date';
import { getSentiment } from 'utils/sentimentsUtils.ts';
import Pause from '../../../../../assets/svg/landing/PauseIcon.svg';
import Play from '../../../../../assets/svg/landing/PlayIcon.svg';
import s from './chatMessage.module.scss';
import { IChatMessageProps } from './ChatMessage.types.ts';

export const MESSAGES_TOP_MULTIPLIER = 250;

const cx = classNames.bind(s);

export const ChatMessage: FC<IChatMessageProps> = ({
  incoming,
  message,
  index,
  isAutoScroll,
  interaction,
  setActiveMessage,
  parentRef,
  botAvatar,
  avatarSrc,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const top = index * MESSAGES_TOP_MULTIPLIER;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // const top = index * MESSAGES_TOP_MULTIPLIER;

  useEffect(() => {
    if (parentRef.current && isAutoScroll) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!message.uri) return;
    audioRef.current = new Audio(message.uri);
  }, [message.uri]);

  const togglePLay = (message: InteractionMessage, isPlay: boolean, duration: number | null) => {
    if (!audioRef.current || !message.uri) return;

    if (isPlay) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(isPlay);
    setActiveMessage(message, duration);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener('ended', handleAudioEnded);
    return () => {
      if (!audioRef.current) return;
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
  return (
    <div
      className={cx({
        wrapper: true,
        incoming,
      })}
      style={{
        top: `${top}px`,
      }}>
      {!incoming ? <Avatar {...botAvatar} styles={s.avatar} /> : <Avatar {...avatarSrc} styles={s.avatar} />}

      <div
        ref={ref}
        className={cx({
          message: true,
        })}
        onClick={() => setActiveMessage(message, duration)}>
        {/*{message.audio_link && <audio src={message.audio_link} ref={audioRef} />}*/}
        <div className={s.message__header}>
          {/* <div className={s.avatar}>
            <UserIcon />
          </div> */}
          <Span className={s.message__header__name}>{!incoming ? 'Bot' : 'User'}</Span>
          <Span className={s.message__header__duration}>
            [{getTime(convertToTimestamp(message.startTimestamp) - convertToTimestamp(interaction.startTimestamp))}]
          </Span>
          {message.uri && (
            <div className={s.message__header__button}>
              {isPlaying ? (
                <img
                  src={Pause}
                  alt="icon"
                  onClick={() => togglePLay(message, false, duration)}
                  className={s.playerButton}
                />
              ) : (
                <img
                  src={Play}
                  alt="icon"
                  onClick={() => togglePLay(message, true, duration)}
                  className={s.playerButton}
                />
              )}
            </div>
          )}
          {message.sentiment && (
            <Tooltip arrow text={`${message.sentiment.charAt(0).toUpperCase() + message.sentiment.slice(1)}`}>
              <div className={s.message__header__sentiment}>
                <img className={s.icon} src={getSentiment(message.sentiment)} alt={`${message.sentiment}`} />
              </div>
            </Tooltip>
          )}
        </div>
        <div className={s.message__content}>
          <Span className={s.message__header__name}>{parse(message.content)}</Span>
        </div>
      </div>
    </div>
  );
};

export const SkeletonMessage = ({ isOperator }: { isOperator: boolean }) => {
  return (
    <div className={cx({ message: true, incoming: isOperator })}>
      <div className={s.message__header}>
        <div className={s.avatar}>
          <UserIcon />
        </div>
      </div>
      <div className={s.message__content}>
        <Skeleton />
        <Skeleton width={150} />
      </div>
    </div>
  );
};

export const Skeleton = (props: SkeletonOwnProps) => {
  return <SkeletonBase variant="text" animation="wave" sx={{ fontSize: '16px' }} {...props} />;
};
