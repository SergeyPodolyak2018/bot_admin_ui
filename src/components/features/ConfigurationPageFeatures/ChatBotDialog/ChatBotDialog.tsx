import CloseIcon from '@mui/icons-material/Close';
import LoopIcon from '@mui/icons-material/Loop';
import MinimizeIcon from '@mui/icons-material/Minimize';
import SendIcon from '@mui/icons-material/North';
import ResizeIcon from 'assets/svg/arrow.svg?react';
import cx from 'classnames';
import { LoadingDots } from 'components/common';
import { UI_BASE_URI } from 'config/constants.ts';
import parse from 'html-react-parser';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStateRef from 'react-usestateref';
import { GET_MESSAGE } from 'services/api/socket/socket.constants.ts';
import {
  addNotification,
  getchatBotWidgetHidden,
  getChatIsOpenedSelectop,
  getConfig,
  selectDevice,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { TimeoutId } from 'types';
import { useSocket } from 'utils/hooks/useSocket.ts';
import logger from 'utils/logger.ts';
import { getDefaultSettingsForChatDialog } from 'utils/template.ts';
import RetryIcon from '../../../../assets/svg/retryIcon.svg';
import { TextareaAutosize } from '../../common/index.ts';
import { BotIconImg } from './BotIconImg.tsx';
import s from './ChaBotDialog.module.scss';
import { UserIconImg } from './UserIconImg.tsx';

export type ChatMessage = {
  content: string;
  type: 'client' | 'ai' | 'participant';
  time: string;
};
export type ChatBotDialogProps = {
  messages: ChatMessage[];
  onClose: () => void;
  onHide: () => void;
  onSendMessage: (msg: ChatMessage) => void;
  botId: number | string;
  chatId: string;
  clearHistory: () => void;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
};

const defaultSettings = getDefaultSettingsForChatDialog();

export const ChatBotDialog: FC<ChatBotDialogProps> = ({
  chatId,
  messages,
  onClose,
  onSendMessage,
  botId,
  clearHistory,
  onHide,
  setMessages,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { bot } = useAppSelector(getConfig);
  const widgetDesign = {
    ...defaultSettings,
    ...(bot!.widgetDesign ? JSON.parse(bot!.widgetDesign as unknown as string) : {}),
  };

  const widgetLogo = bot!.widgetLogo ? `data:${widgetDesign.logoMimeType};base64,${bot!.widgetLogo}` : `botIcon`;
  const chatIsOpened = useAppSelector(getChatIsOpenedSelectop);
  const isChatBotWidgetHidden = useAppSelector(getchatBotWidgetHidden);

  const user = useAppSelector(selectUser);
  const device = useAppSelector(selectDevice);

  const [connectionIsOpened, connectionState] = useState(true);

  const [input, setInput] = useState('');
  const [, setResponseText, responseTextRef] = useStateRef<string | null>(null);
  const [, setIsEnd, isEndRef] = useStateRef<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const customerTypingTimerRef = useRef<TimeoutId | null>(null);

  const footerChatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<TimeoutId | null>(null);

  const getTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  useEffect(() => {
    if (!chatIsOpened) {
      wsSend({ event: 'stop', botId: botId, chatId: chatId });
      logger.info(`WebSocket connection closed to ${GET_MESSAGE}`);
      reset();
      connectionState(false);
      clearHistory();
    }
  }, [chatIsOpened]);

  const [errorShowed, setErrorShowed] = useState(false);
  const { socketRef, retryConnect, isConnected, wsSend } = useSocket({
    url: `${GET_MESSAGE}`,
    initOnLoad: true,
    onClose: () => {
      wsSend({ event: 'stop', botId: botId, chatId: chatId });
      logger.info(`WebSocket connection closed to ${GET_MESSAGE}`);
      reset();
      connectionState(false);
      clearHistory();
    },
    onOpen: () => {
      logger.info(`open WebSocket connection to ${GET_MESSAGE}`);
      wsSend({ event: 'start', botId: botId, chatId: chatId, userId: user?.id, device });
      connectionState(true);
      setIsLoading(false);
      setIsEnd(true);
      setErrorShowed(false);
    },
    onError: (msg) => {
      logger.error(`WebSocket connection error to ${GET_MESSAGE}`);
      socketRef.current?.close();
      reset();
      connectionState(false);
      if (!errorShowed) {
        const message = typeof msg === 'string' ? msg : '';
        dispatch(addNotification({ type: 'error', title: 'Connection Error', message }));
        setErrorShowed(true);
      }
    },
    onMessage: (event: any) => {
      const data = JSON.parse(event.data);

      if (data.event === 'typing') {
        setIsAgentTyping(data.value === 'start');
      }

      if (data.event === 'participantJoin') {
        setIsUser(true);
        setMessages((prevState) => [
          ...prevState,
          {
            type: 'participant',
            content: 'Participant joined',
            time: new Date().toISOString(),
          },
        ]);
      }

      if (data.event === 'participantLeft') {
        setIsUser(false);
        setMessages((prevState) => [
          ...prevState,
          {
            type: 'participant',
            content: 'Participant left',
            time: new Date().toISOString(),
          },
        ]);
      }

      if (data.text) {
        const txt = data.text.replace(/\n/g, '<br>');
        typing(txt, data.isEnd);
        setIsEnd(data.isEnd);
      }

      if (data.isEnd && responseTextRef.current) {
        onSendMessage({ type: 'ai', content: responseTextRef.current, time: getTime() });
        setResponseText(null);
        setIsEnd(true);
      }
    },
  });

  useEffect(() => {
    if (isConnected) {
      setIsLoading(false);
      textareaRef?.current?.focus();
    } else {
      setIsLoading(true);
    }

    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, [socketRef.current?.readyState]);

  const sendBySocket = (text: string) => {
    if (!isUser && (!isEndRef.current || isLoading)) return;
    if (!text) return;
    if (socketRef.current?.readyState === 3) return logger.error(`WebSocket state is closed`);

    try {
      onSendMessage({ type: 'client', content: text, time: getTime() });
      setInput('');
      socketRef.current && setIsEnd(false);

      wsSend({ message: text, chatId, botId });
    } catch (e: unknown) {
      logger.error(`sendBySocket() =>`, e);
      setIsEnd(true);
    }
  };

  const reset = () => {
    setResponseText(null);
    setIsEnd(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, responseTextRef.current]);

  useEffect(() => {
    if (socketRef.current?.readyState === 3 || !isConnected) return logger.error(`WebSocket state is closed`);
    isUser && wsSend({ event: 'typing', value: isCustomerTyping ? 'start' : 'end', chatId, userId: user?.id, botId });
  }, [isCustomerTyping]);

  const scrollToBottom = () => {
    if (footerChatRef.current) {
      footerChatRef.current.scrollTop = footerChatRef.current.scrollHeight;
    }
  };

  const typing = (token: string, isEnd: boolean) => {
    // responseTextRef.current = responseTextRef.current ? `${responseTextRef.current}${token}` : `${token}`;
    setResponseText(responseTextRef.current ? `${responseTextRef.current}${token}` : `${token}`);

    if (isEnd && responseTextRef.current) {
      onSendMessage({ type: 'ai', content: responseTextRef.current, time: getTime() });
      setResponseText(null);
    }
  };
  // region textarea
  const handleInputChange = (val: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const height = textarea.scrollHeight <= 400 ? textarea.scrollHeight : 400;

    textarea.style.height = `${height - 20}px`;
    setInput(val);
  };
  // endregion

  // region resizing
  const RESIZE_CONSTRAINTS = {
    minWidth: 300,
    minHeight: 400,
    maxWidth: 1400,
    maxHeight: 1800,
  };
  const [size, setSize] = useState({ width: widgetDesign.width, height: widgetDesign.height });
  const [, setIsResizing, isResizingRef] = useStateRef(false);
  const initialMouseX = useRef(0);
  const initialMouseY = useRef(0);
  const handleMouseDown = (event: MouseEvent) => {
    setIsResizing(true);
    initialMouseX.current = event.clientX;
    initialMouseY.current = event.clientY;
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizingRef.current) {
      const deltaX = e.clientX - initialMouseX.current;
      const deltaY = e.clientY - initialMouseY.current;

      setSize((prevSize) => {
        return {
          width: Math.max(RESIZE_CONSTRAINTS.minWidth, Math.min(RESIZE_CONSTRAINTS.maxWidth, prevSize.width - deltaX)),
          height: Math.max(
            RESIZE_CONSTRAINTS.minHeight,
            Math.min(RESIZE_CONSTRAINTS.maxHeight, prevSize.height - deltaY),
          ),
        };
      });

      initialMouseX.current = e.clientX;
      initialMouseY.current = e.clientY;
    }
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleDocumentMouseUp = () => handleMouseUp();

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, []);
  // endregion

  const getWidgetPosition = () => {
    if (widgetDesign.widgetPosition === 'leftBottom') {
      return { left: widgetDesign.horizontalMargin + 'px', bottom: widgetDesign.verticalMargin + 'px' };
    } else {
      return { right: widgetDesign.horizontalMargin + 'px', bottom: widgetDesign.verticalMargin + 'px' };
    }
  };

  const getIsHidden = () => {
    if (isChatBotWidgetHidden) {
      return { display: 'none' };
    } else {
      return {};
    }
  };

  return (
    <div
      className={s.chatContainer}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        background: `${widgetDesign.backgroundColor}`,
        borderRadius: `${widgetDesign.widgetRoundCorners}px`,
        ...getWidgetPosition(),
        ...getIsHidden(),
      }}>
      {!connectionIsOpened && (
        <div
          className={s.connectionLostContainer}
          style={{
            borderRadius: `${widgetDesign.widgetRoundCorners}px`,
          }}>
          <span className={s.label}>No connection with Server</span>
          <div
            className={s.button}
            onClick={() => {
              retryConnect();
            }}>
            <img className={s.icon} src={RetryIcon} alt="RetryIcon" />
            <span className={s.label}>Retry</span>
          </div>
        </div>
      )}
      <span
        className={s.chatContainer__resizeBtn}
        style={{ pointerEvents: isResizingRef.current ? 'none' : 'auto', userSelect: 'none' }}
        onMouseDown={(e) => handleMouseDown(e as unknown as MouseEvent)}>
        <ResizeIcon />
      </span>
      <div
        className={cx([s.chatHeader])}
        style={{
          color: `${widgetDesign.headerColorText}`,
          background: `${widgetDesign.headerColor}`,
          borderTopRightRadius: `${widgetDesign.widgetRoundCorners}px`,
          borderTopLeftRadius: `${widgetDesign.widgetRoundCorners}px`,
        }}>
        <div className={s.operatorInfo}>
          <div className={s.operatorPhoto}>
            <BotIconImg src={widgetLogo} style={{ width: 50, height: 50, borderRadius: 36 }} />
          </div>
          <div className={s.operatorDetails}>
            <p
              className={s.operatorName}
              style={{ fontSize: `${widgetDesign.titleFontSize}px`, color: `${widgetDesign.headerColorText}` }}>
              {widgetDesign.agentName || bot!.name}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <MinimizeIcon
            className={s.close}
            style={{ color: `${widgetDesign.closeButtonColor}` }}
            onClick={() => {
              onHide();
            }}></MinimizeIcon>
          <CloseIcon
            className={s.close}
            style={{ color: `${widgetDesign.closeButtonColor}` }}
            onClick={() => {
              onClose();
              wsSend({ event: 'stop', botId: botId, chatId: chatId });
              timerRef.current && clearTimeout(timerRef.current);
            }}></CloseIcon>
        </div>
      </div>
      <div className={s.chatMessages} id="chat-messages" ref={footerChatRef}>
        {messages.map((m, index) => {
          if (m.type === 'participant') {
            return (
              <div className={s.joinedMessage} key={index}>
                {m.content}
              </div>
            );
          }

          return (
            <div
              key={index}
              style={{ display: 'flex', flexDirection: `${m.type === 'client' ? 'row-reverse' : 'row'}` }}>
              <div className={s.iconInChat}>
                {m.type === 'client' && (
                  <UserIconImg
                    class={s.iconInChat}
                    style={{
                      marginRight: '0px',
                      marginLeft: '5px',
                    }}
                  />
                )}
                {m.type === 'ai' && (
                  <BotIconImg
                    class={s.iconInChat}
                    src={widgetLogo}
                    style={{
                      marginRight: `5px`,
                      marginLeft: `0px`,
                    }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                <div
                  className={[s.message, m.type === 'client' ? s.userMessage : s.operatorMessage].join(' ')}
                  style={{
                    color: `${
                      m.type === 'client' ? widgetDesign.userMessageTextColor : widgetDesign.agentMessageTextColor
                    }`,
                    background: `${
                      m.type === 'client'
                        ? widgetDesign.userMessageBackgroundColor
                        : widgetDesign.agentMessageBackgroundColor
                    }`,
                  }}>
                  <div className={s.messageContent} style={{ fontSize: `${widgetDesign.fontSize}px` }}>
                    {parse(m.content)}
                  </div>
                </div>
                <p
                  style={{
                    textAlign: `${m.type === 'client' ? 'left' : 'right'}`,
                    fontSize: `${widgetDesign.fontSize - 5}px`,
                  }}
                  className={s.timeText}>
                  {m.time}
                </p>
              </div>
            </div>
          );
        })}
        {responseTextRef.current && (
          // <div className={cx(s.message, s.operatorMessage)}>
          //   <p className={s.uname}>{selectedBot?.name || t('callStatsPageFeatures.bot')}</p>
          //   <div className={s.messageContent}>
          //     <span>{parse(responseTextRef.current)}</span>
          //     <IconSendLoad />
          //   </div>
          // </div>
          <div style={{ display: 'flex', flexDirection: `row` }}>
            <BotIconImg
              class={s.iconInChat}
              src={widgetLogo}
              style={{
                marginRight: `5px`,
                marginLeft: `0px`,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
              <div
                className={[s.message, s.operatorMessage].join(' ')}
                style={{
                  color: `${widgetDesign.agentMessageTextColor}`,
                  background: `${widgetDesign.agentMessageBackgroundColor}`,
                }}>
                <div className={s.messageContent} style={{ fontSize: `${widgetDesign.fontSize}px` }}>
                  {parse(responseTextRef.current)}
                </div>
              </div>
            </div>
          </div>
        )}

        {isAgentTyping && (
          <div style={{ display: 'flex', flexDirection: `row`, alignItems: 'center' }}>
            <BotIconImg
              class={cx(s.iconInChat, s.iconInChat__typing)}
              src={widgetLogo}
              style={{
                marginRight: `5px`,
                marginLeft: `0px`,
              }}
            />
            <div>
              <LoadingDots />
            </div>
          </div>
        )}
      </div>
      <div className={s.chatInput}>
        <div
          style={{
            fontSize: `${widgetDesign.fontSize}px`,
            background: `${widgetDesign.inputBackgroundColor}`,
            color: `${widgetDesign.inputTextColor}`,
          }}>
          <TextareaAutosize
            maxRows={3}
            className={s.chatInput__input}
            ref={textareaRef}
            id="messageInput"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t('configurationPageFeatures.inputYourMessage')}
            onKeyDown={(e) => {
              setIsCustomerTyping(true);
              customerTypingTimerRef.current && clearTimeout(customerTypingTimerRef.current);
              customerTypingTimerRef.current = setTimeout(() => setIsCustomerTyping(false), 1500);

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
          {isUser || (isEndRef.current && !isLoading) ? (
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

      <a href={UI_BASE_URI} className={s.sign} target="_blank" rel="noreferrer">
        <p style={{ textAlign: 'center' }}>Powered by BOT</p>
      </a>
    </div>
  );
};
