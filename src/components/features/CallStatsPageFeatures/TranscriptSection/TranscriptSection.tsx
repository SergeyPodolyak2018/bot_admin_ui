import LoopIcon from '@mui/icons-material/Loop';
import SendIcon from '@mui/icons-material/North';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames/bind';
import { H3, LoadingDots } from 'components/common';
import { TextareaAutosize } from 'components/features/common';
import { stringAvatar } from 'pages/OrganisationsPage/utils.ts';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStateRef from 'react-usestateref';
import { CHAT_MESSAGE, GET_MESSAGE } from 'services';
import { getFiltersSelector, selectDevice, selectUser } from 'store/index.ts';
import { useAppSelector } from 'store/store.hooks.ts';
import { Interaction, InteractionMessage, TimeoutId } from 'types';
import { useSocket } from 'utils/hooks';
import logger from 'utils/logger.ts';
import { pythonTimestampToJsTimestamp } from 'utils/primitives/date';
import { getDefaultSettingsForChatDialog } from 'utils/template.ts';
import { ChatMessage, MESSAGES_TOP_MULTIPLIER, SkeletonMessage } from './ChatMessage/index.ts';
import { SetActiveMessageArgs } from './ChatMessage/ChatMessage.types.ts';
import s from './transcriptSection.module.scss';

const cx = classNames.bind(s);

type TranscriptSectionProps = {
  isUser: boolean;
  interaction: Interaction;
  messages: InteractionMessage[];
  setMessages: Dispatch<SetStateAction<InteractionMessage[]>>;
  setActiveMessage: SetActiveMessageArgs;
};
const widgetDesign = getDefaultSettingsForChatDialog();
export const TranscriptSection: FC<TranscriptSectionProps> = ({
  isUser,
  interaction,
  messages,
  setActiveMessage,
  setMessages,
}) => {
  const { t } = useTranslation();
  const filters = useAppSelector(getFiltersSelector);
  const user = useAppSelector(selectUser);
  const device = useAppSelector(selectDevice);

  const [isAutoScroll] = useState(true);
  const [input, setInput] = useState('');
  const [, setIsEnd, isEndRef] = useStateRef<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [footerText, setFooterText] = useState('');

  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);

  const [avatarSrc, setAvatarSrc] = useState<any>(null);
  const [botAvatar, setBotAvatar] = useState<any>(null);

  const userTypingTimerRef = useRef<TimeoutId | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const textareaRef = useRef(null);
  // const countInOneSec = 1000 / (callStats.audio_status.ms_in_one_chunk || 100);

  const sortedMessages = useMemo(() => {
    const localMessages = messages.slice().sort((a, b) => {
      return new Date(a.startTimestamp).getTime() - new Date(b.startTimestamp).getTime();
    });

    const filteredMessages = localMessages.filter((message) => {
      return filters.includes(message.sentiment);
    });

    return filteredMessages;
  }, [messages, filters]);

  useEffect(() => {
    if (user) {
      if (user.avatar) {
        setAvatarSrc({ src: `data:${user.avatarMime};base64,${user!.avatar}` });
      } else {
        setAvatarSrc(stringAvatar(user.email));
      }
    }
    setBotAvatar(stringAvatar('Bot'));
  }, [user]);

  const { wsSend, socketRef, connectSocket, close, isConnected } = useSocket({
    initOnLoad: false,
    url: CHAT_MESSAGE,
    onOpen: () => {
      logger.info(`open WebSocket connection to ${GET_MESSAGE}`);
      wsSend({
        event: 'start',
        botId: interaction.botId,
        chatId: interaction.id,
        userId: user?.id,
        role: 'agent',
        device,
      });
      // connectionState(true);
      setIsLoading(false);
      setIsEnd(true);
      // setErrorShowed(false);
    },
    onMessage: (event) => {
      // @ts-expect-error err
      const data = JSON.parse(event.data);

      if (data.event === 'typing') {
        setIsCustomerTyping(data.value === 'start');
      }
      if (data.event === 'history') {
        if (data.messages) {
          // audio_link: null;
          // end_of_speaking: null;
          // id: '7a4eccc1-656f-42b5-9d0d-92e5c8b7bb79';
          // text: 'Hi, this is Table reservation, how may I help you?';
          // time_stamp: 1715331788.9449341;
          // type: 'answer';
          const msg: InteractionMessage[] = data.messages.map((msg: any) => ({
            id: msg.id,
            interactionId: msg.id,
            startTimestamp: pythonTimestampToJsTimestamp(msg.time_stamp),
            finishTimestamp: '',
            sentiment: '',
            description: '',
            uri: msg.audio_link,
            content: msg.text,
            type: msg.type,
          }));
          setMessages(msg);
        }
      }

      if (data.event === 'participantLeft') {
        setFooterText('Participant left');
        close();
        setIsFinished(true);
      }
      if (data.text) {
        const txt = data.text.replace(/\n/g, '<br>');
        // typing(txt, data.isEnd);

        setMessages((prevState) => [
          ...prevState,
          {
            id: '',
            interactionId: '',
            startTimestamp: new Date().toISOString(),
            finishTimestamp: '',
            sentiment: '',
            description: '',
            uri: '',
            content: txt,
            type: 'question',
          },
        ]);
        setIsEnd(data.isEnd);
      }

      if (data.isEnd) {
        // setResponseText(null);
        setIsEnd(true);
      }
    },
  });

  useEffect(() => {
    isUser && connectSocket();
  }, [isUser]);

  useEffect(() => {
    if (socketRef.current?.readyState === 3 || !isConnected) return logger.error(`WebSocket state is closed`);
    wsSend({
      event: 'typing',
      value: isUserTyping ? 'start' : 'end',
      chatId: interaction.id,
      userId: user?.id,
      botId: interaction.botId,
      role: 'agent',
    });
  }, [isUserTyping]);

  const sendBySocket = (text: string) => {
    // if (!isEndRef.current || isLoading) return;
    if (isFinished) return;
    if (!text) return;
    if (socketRef.current?.readyState === 3) return logger.error(`WebSocket state is closed`);

    try {
      // onSendMessage({ type: 'client', content: text, time: getTime() });
      setInput('');
      // socketRef.current && setIsEnd(false);
      setMessages((prevState) => [
        ...prevState,
        {
          id: '',
          interactionId: '',
          startTimestamp: new Date().toISOString(),
          finishTimestamp: '',
          sentiment: '',
          description: '',
          uri: '',
          content: text,
          type: 'answer',
        },
      ]);
      wsSend({ message: text, chatId: interaction.id, botId: interaction.botId, userId: user?.id, role: 'agent' });
    } catch (e: unknown) {
      logger.error(`sendBySocket() =>`, e);
      setIsEnd(true);
    }
  };
  const handleInputChange = (val: string) => {
    const textarea: any = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const height = textarea.scrollHeight <= 400 ? textarea.scrollHeight : 400;

    textarea.style.height = `${height - 20}px`;
    setInput(val);
  };

  return (
    <section className={`${s.chat} ${interaction.type === 'text_chat' ? s.chat__singleRow : ''}`}>
      <div className={s.chat__header}>
        <H3 style={{ fontWeight: '700' }}>{t('callStatsPageFeatures.transcript')}</H3>
        {/* <div>
          <Span>{t('callStatsPageFeatures.autoScroll')}</Span>
          <Switch
            disabled={false}
            onChange={() => {
              setIsAutoScroll(!isAutoScroll);
            }}
            size="small"
            checked={isAutoScroll}
          />
        </div> */}
      </div>

      <div className={s.chat_messages} ref={ref}>
        {sortedMessages
          ? sortedMessages.map((message, index) => {
              return (
                <ChatMessage
                  botAvatar={botAvatar}
                  avatarSrc={avatarSrc}
                  incoming={message.type !== 'answer'}
                  setActiveMessage={setActiveMessage}
                  interaction={interaction}
                  isAutoScroll={isAutoScroll}
                  index={index}
                  message={message}
                  key={message.id}
                  parentRef={ref}
                />
              );
            })
          : Array.from({ length: 10 }).map((_, index) => {
              return <SkeletonMessage isOperator={index % 2 === 0} key={index} />;
            })}
        {isCustomerTyping && (
          <div className={s.typingContainer}>
            <Avatar {...avatarSrc} styles={s.avatar} />
            <LoadingDots />
          </div>
        )}

        {<div className={s.chat__footerText}>{footerText}</div>}
        {/*<VerticalRuler*/}
        {/*  segmentsLength={callStats?.other_status?.text_sent_to_model.length}*/}
        {/*  duration={callStats.audio_status.waveformData.length / countInOneSec}*/}
        {/*/>*/}
      </div>
      {!isFinished && isUser && (
        <div className={s.chatInput}>
          <div>
            <TextareaAutosize
              maxRows={3}
              className={s.chatInput__input}
              ref={textareaRef}
              id="messageInput"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={'Write a message...'}
              onKeyDown={(e) => {
                setIsUserTyping(true);
                userTypingTimerRef.current && clearTimeout(userTypingTimerRef.current);
                userTypingTimerRef.current = setTimeout(() => setIsUserTyping(false), 1500);

                if (e.shiftKey && e.key === 'Enter') {
                  setInput((prev) => `${prev}`);
                  return;
                }
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendBySocket(input);
                }
              }}
            />
            {isEndRef.current && !isLoading ? (
              <SendIcon
                sx={{
                  color: `${widgetDesign.buttonTextColor}`,
                  background: `${widgetDesign.buttonBackgroundColor}`,
                  borderRadius: `${widgetDesign.sendButtonRoundCorner}px`,
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  padding: '5px',
                }}
                onClick={() => sendBySocket(input)}></SendIcon>
            ) : (
              <LoopIcon
                className={s.loopIcon}
                sx={{
                  color: `${widgetDesign.buttonTextColor}`,
                  background: `${widgetDesign.buttonBackgroundColor}`,
                  borderRadius: `20px`,
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  padding: '5px',
                }}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VerticalRuler = ({ segmentsLength, duration }: { duration: number; segmentsLength: number }) => {
  const ruler = Array.from({ length: duration / 100 }).map((_, index) => {
    const isHour = index % 10 === 0;
    const seconds = index % 60;
    const secondsWithZero = seconds < 10 ? `0${seconds}` : seconds;
    const timeString = `${Math.floor(index / 60)}:${secondsWithZero}`;

    return (
      <div
        key={index}
        className={cx({
          ruler__item: true,
          hour: isHour,
        })}
        data-hour={`${timeString}`}
      />
    );
  });
  const totalHeight = segmentsLength * MESSAGES_TOP_MULTIPLIER;

  // const flooredDuration = Math.floor(duration);
  // const seconds = flooredDuration % 60;
  // const secondsWithZero = seconds < 10 ? `0${seconds}` : seconds;

  // const shouldRenderLastTick = flooredDuration % 5 === 0;
  return (
    <div
      className={s.ruler}
      style={{
        height: `${totalHeight}px`,
      }}>
      {ruler}
      {/* {shouldRenderLastTick && (
        <div
          className={cx({
            ruler__item: true,
            theLastOne: true,
          })}
          data-hour={`${Math.floor(flooredDuration / 60)}:${secondsWithZero}`}
        />
      )} */}
    </div>
  );
};
