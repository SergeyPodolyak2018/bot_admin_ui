import {
  InteractionDetailsSection,
  InteractionPlayer,
  TopicsSection,
  TopicsSummary,
  TranscriptSection,
} from 'components/features';
import { MainContainerHeader } from 'components/features/CallStatsPageFeatures/Header/MainContainerHeader';
import { PageHeader } from 'components/features/common/MainLayout/PageHeader';
import { NavigationEnum } from 'navigation';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInteractionById, getMessagesByInteractionId } from 'services/api';
import { addNotification, decLoaderCountAction, fetchOrganisations, incLoaderCountAction, useAppDispatch } from 'store';
import { Interaction, InteractionMessage, Sentiments } from 'types';
import logger from 'utils/logger.ts';
import { calculateSentimentPercentage } from 'utils/sentimentsUtils';
import s from './InteractionDetailsPage.module.scss';

export const InteractionDetailsPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [activeMessage, setActiveMessage] = useState<InteractionMessage>();
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [messages, setMessages] = useState<InteractionMessage[]>([]);
  const [sentiments, setSentiments] = useState<Sentiments>({ positive: 0, neutral: 0, negative: 0 });
  const [isUser, setIsUser] = useState(false);

  const handleRefresh = () => {
    fetchInteraction(id);
  };

  useEffect(() => {
    fetchInteraction(id);
  }, [id]);

  useEffect(() => {
    dispatch(fetchOrganisations());
  }, []);

  const fetchInteraction = (interactionId: string | number | undefined) => {
    if (!interactionId) return;

    dispatch(incLoaderCountAction());
    getInteractionById(interactionId)
      .then((r) => {
        setInteraction(r.data);
      })
      .catch((err) => {
        dispatch(addNotification({ title: 'Error with get Interactions', message: err.message, type: 'error' }));
        navigate(NavigationEnum.INTERACTIONS);
        logger.error(`Interaction err ${id}`, err);
      })
      .finally(() => {
        dispatch(decLoaderCountAction());
      });

    getMessagesByInteractionId(interactionId)
      .then((r) => {
        setMessages(r.data);
      })
      .catch((err) => {
        dispatch(addNotification({ title: 'Error with get messages', message: err.message, type: 'error' }));
        logger.error(`Interaction err ${id}`, err);
      });
  };

  useEffect(() => {
    setSentiments(calculateSentimentPercentage(messages));
  }, [messages]);

  if (!interaction) return <></>;

  const handleDownload = () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = interaction.uri;
    downloadLink.download = 'audio_file.wav';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleClickStartConversation = () => {
    setIsUser(true);
  };

  return (
    <>
      <PageHeader
        title={'Interaction'}
        subtitle={'See types of user interactions with AI Agent.'}
        onClickRefresh={handleRefresh}
        onClickBack={() => {
          navigate(NavigationEnum.INTERACTIONS);
        }}
      />
      <div className={s.main}>
        {/* <div className={`${interaction?.type === 'text_chat' ? s.content__singleRow : s.content__allRows}`}>
          <InteractionPlayer interaction={interaction} activeMessage={activeMessage} />
          <TranscriptSection
            messages={messages}
            interaction={interaction}
            setActiveMessage={(msg) => setActiveMessage(msg)}
          />
          <TopicsSummary interaction={interaction} />
          <div
            className={`${s.content__container} ${
              interaction.type === 'text_chat' ? s.content__container__singleRow : ''
            }`}>
            <InteractionDetailsSection interaction={interaction} />
          
            {/* <FilterSentimentSection sentiments={sentiments} /> */}
        {/* <TopicsSection messages={messages} />
          </div>
        </div>  */}
        {/* <SentimentAnalysisSection sentiments={sentiments} /> */}
        <div className={s.mainContentContainer}>
          <MainContainerHeader
            interaction={interaction}
            onRefresh={handleRefresh}
            onDownload={handleDownload}
            onStartConversation={handleClickStartConversation}
            isUser={isUser}
          />
          <InteractionPlayer interaction={interaction} activeMessage={activeMessage} />
          <TranscriptSection
            setMessages={setMessages}
            isUser={isUser}
            messages={messages}
            interaction={interaction}
            setActiveMessage={(msg) => setActiveMessage(msg)}
          />
        </div>
        <div className={s.sideContentContainer}>
          <InteractionDetailsSection interaction={interaction} />
          <TopicsSummary interaction={interaction} />
          <TopicsSection messages={messages} interactionFinished={interaction?.finishTimestamp !== null} />
        </div>
      </div>
    </>
  );
};
