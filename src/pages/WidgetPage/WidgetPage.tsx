import { ChatBotDialog, ChatBotWidget, ChatMessage } from 'components/features';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import robotHand from '../../assets/img/robotHand.png';
import s from './WidgetPage.module.scss';

export const WidgetPage = () => {
  const { botId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const handleClickRunBot = async () => {
    setIsDialogOpen(!isDialogOpen);
  };

  useEffect(() => {
    setChatId(v4());
  }, []);

  return (
    <div className={s.container}>
      <div className={s.firstHandContainer}>
        <img src={robotHand} alt={'hand'}></img>
      </div>
      <div className={s.secondHandContainer}>
        <img src={robotHand} alt={'hand'}></img>
      </div>
      {!isDialogOpen && <ChatBotWidget onClick={() => handleClickRunBot()} />}
      {botId && chatId && (
        <ChatBotDialog
          setMessages={setMessages}
          chatId={chatId}
          botId={botId}
          clearHistory={() => setMessages([])}
          onClose={() => {
            setIsDialogOpen(false);
            setMessages([]);
          }}
          onHide={() => true}
          messages={messages}
          onSendMessage={(msg) => setMessages((prev) => [...prev, msg])}
        />
      )}
    </div>
  );
};
