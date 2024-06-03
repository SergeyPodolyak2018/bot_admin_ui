import BotIcon from 'assets/svg/bot.svg?react';
import { FC } from 'react';
import './ChatBotWidget.scss';

export type ChatBotWidgetProps = {
  onClick: () => void;
};
export const ChatBotWidget: FC<ChatBotWidgetProps> = ({ onClick }) => {
  return (
    <div className="chat-button">
      <BotIcon onClick={onClick} />
    </div>
  );
};
