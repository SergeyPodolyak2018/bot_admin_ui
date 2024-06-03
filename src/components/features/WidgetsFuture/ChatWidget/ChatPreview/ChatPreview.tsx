import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/North';
import cx from 'classnames';

import parse from 'html-react-parser';
import { useState } from 'react';
import { TWidgetDesign } from 'types';
import UserIconSvg from '../../../../../assets/svg/userIcon.svg';
import { TextareaAutosize } from '../../../common';
import s from './ChatPreview.module.scss';
import MinimizeIcon from '@mui/icons-material/Minimize';

type TProps = {
  data: TWidgetDesign;
  image: string;
};
export const ChatPreview = ({ data, image }: TProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isShowInputMessage, setIsShowInputMessage] = useState(false);
  const openForm = () => {
    setIsOpen((prev) => !prev);
  };

  const messages = [
    { type: 'bot', content: 'welcome' },
    { type: 'client', content: 'Do you have pizza?' },
    { type: 'bot', content: 'Yes we have many proposition. What pizza do you like?' },
    { type: 'client', content: 'I Like a pepperoni pizza' },
  ];

  const getWidgetPosition = () => {
    return {};
    // if (data.widgetPosition === 'leftBottom') {
    //   return { marginLeft: data.horizontalMargin + 'px', marginBottom: data.verticalMargin + 'px' };
    // } else {
    //   return { marginRight: data.horizontalMargin + 'px', marginBottom: data.verticalMargin + 'px' };
    // }
  };

  const WidgetWindow = () => {
    return (
      <div
        className={s.chatContainer}
        style={{
          width: `${data.width}px`,
          height: `${data.height}px`,
          background: `${data.backgroundColor}`,
          borderRadius: `${data.widgetRoundCorners}px`,
          ...getWidgetPosition(),
        }}>
        <div
          className={cx([s.chatHeader])}
          style={{
            color: `${data.headerColorText}`,
            background: `${data.headerColor}`,
            borderTopRightRadius: `${data.widgetRoundCorners}px`,
            borderTopLeftRadius: `${data.widgetRoundCorners}px`,
          }}>
          <div className={s.operatorInfo}>
            <div className={s.operatorPhoto}>
              <img src={image} style={{ width: 50, height: 50, borderRadius: 36 }} alt={''} />
            </div>
            <div className={s.operatorDetails}>
              <p
                className={s.operatorName}
                style={{ fontSize: `${data.titleFontSize}px`, color: `${data.headerColorText}` }}>
                {data.agentName}
              </p>
              {/*<p className='operator-position'>{bot?.name}</p>*/}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <MinimizeIcon className={s.close} style={{ color: `${data.closeButtonColor}` }}></MinimizeIcon>
            <CloseIcon className={s.close} style={{ color: `${data.closeButtonColor}` }}></CloseIcon>
          </div>
        </div>
        <div className={s.chatMessages} id="chat-messages">
          {messages.map((m, index) => (
            <div
              key={index}
              style={{ display: 'flex', flexDirection: `${m.type === 'client' ? 'row-reverse' : 'row'}` }}>
              <img
                className={s.iconInChat}
                alt={''}
                src={m.type === 'client' ? UserIconSvg : image}
                style={{
                  marginRight: `${m.type !== 'client' ? '5px' : '0px'}`,
                  marginLeft: `${m.type === 'client' ? '5px' : '0px'}`,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  className={[s.message, m.type === 'client' ? s.clientMessage : s.operatorMessage].join(' ')}
                  style={{
                    color: `${m.type === 'client' ? data.userMessageTextColor : data.agentMessageTextColor}`,
                    background: `${
                      m.type === 'client' ? data.userMessageBackgroundColor : data.agentMessageBackgroundColor
                    }`,
                  }}>
                  <div className={s.messageContent} style={{ fontSize: `${data.fontSize}px` }}>
                    {parse(m.content)}
                  </div>
                </div>
                <p
                  style={{ textAlign: `${m.type === 'client' ? 'left' : 'right'}`, fontSize: `${data.fontSize - 5}px` }}
                  className={s.timeText}>
                  07:05 PM
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={s.chatInput}>
          <div
            style={{
              fontSize: `${data.fontSize}px`,
              background: `${data.inputBackgroundColor}`,
              color: `${data.inputTextColor}`,
            }}>
            <TextareaAutosize
              maxRows={3}
              className={s.chatInput__input}
              id="messageInput"
              defaultValue={isShowInputMessage ? 'Your Test Message' : ''}
              placeholder={data.inputPlaceholder}
              onFocus={() => setIsShowInputMessage(true)}
              onBlur={() => setIsShowInputMessage(false)}
            />
            <SendIcon
              sx={{
                color: `${data.buttonTextColor}`,
                background: `${data.buttonBackgroundColor}`,
                borderRadius: `${data.sendButtonRoundCorner}px`,
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                padding: '5px',
              }}
            />
          </div>
        </div>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href={'https://BOT.ai/'} target="_blank" className={s.sign} rel="noreferrer">
          <p style={{ textAlign: 'center' }}>Powered by BOT</p>
        </a>
      </div>
    );
  };
  return (
    <>
      {isOpen && WidgetWindow()}
      {!isOpen && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img
          alt={'Button'}
          src={image}
          className={s.chatButton}
          style={{ ...getWidgetPosition() }}
          onClick={openForm}
        />
      )}
    </>
  );
};
