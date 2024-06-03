import { Button, Loader } from 'components/common';
import { serialize } from 'object-to-formdata';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { putCategore, REFRESH_BOT, updateBot } from 'services/api';
import {
  addNotification,
  fetchConfig,
  getConfig,
  selectUser,
  setChatIsOpened,
  setShowEditWindow,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { categoryForUpdate } from 'utils/botUtils';
import { useSocket } from 'utils/hooks/useSocket';
import logger from 'utils/logger';
import { v4 } from 'uuid';
import { ChatBotDialog, ChatMessage } from '.';
import { TemplateConfiguration } from '../TemplateBotConfigFeature/Configuration';
import { SearchTest } from '../TemplateBotConfigFeature/SearchTest';
import styles from './Configuration.module.scss';
import { SideBar } from './Nodes/SideBar';
import { useConfiguration } from './useConfiguration';

export const Configuration = () => {
  const dispatch = useAppDispatch();
  const { botId } = useParams();
  const { t } = useTranslation();

  const userInfo = useAppSelector(selectUser);
  const config = useAppSelector(getConfig);

  const [activeTab, setActiveTab] = useState('agentConfiguration');
  const [, setInitPhoneNumber] = useState(config.bot?.phone || '');

  useEffect(() => {
    setInitPhoneNumber(config.bot?.phone || '');
  }, [config.bot?.id]);

  const confHookData = useConfiguration({ botId });

  const updateSchema = async () => {
    const result = categoryForUpdate(confHookData.config.categories, confHookData.nodes, confHookData.edges);
    const promisContainer = [];
    if (result.length === 0) {
      dispatch(
        addNotification({
          message: t('configurationPageFeatures.nothingToUpdate'),
          type: 'info',
          title: t('configurationPageFeatures.publish'),
        }),
      );
      return;
    }
    for (const iterator of result) {
      promisContainer.push(putCategore(iterator.id as number, iterator));
    }
    await Promise.allSettled(promisContainer)
      .then(() => {
        dispatch(
          addNotification({
            message: t('configurationPageFeatures.schemaUpdated'),
            type: 'success',
            title: t('configurationPageFeatures.publish'),
          }),
        );
      })
      .catch(() => {
        dispatch(
          addNotification({
            message: t('configurationPageFeatures.schemaNotUpdated'),
            type: 'error',
            title: t('configurationPageFeatures.publish'),
          }),
        );
      });
    // connectSocket();
  };

  const updateAgentConfig = async () => {
    if (config.bot?.changed) {
      // const phone = await getPhoneNumber(config.bot.phone, initPhoneNumber, (e) => {
      //   dispatch(addNotification({ type: 'error', title: 'Error to get phone number', message: e.message }));
      // });

      const data = serialize({
        name: config.bot.name,
        organizationId: config.bot.organization.id,
        greeting: config.bot.greeting,
        useContext: config.bot.useContext,
        useHistory: config.bot.useHistory,
        useRemarks: config.bot.useRemarks,
        botPrompt: config.bot.botPrompt,
        recordId: config.bot.recordId,
        // phone: phone,
      });
      await updateBot(data, config.bot.id)
        .then(() => {
          dispatch(
            addNotification({
              message: t('configurationPageFeatures.agentConfigUpdated'),
              type: 'success',
              title: t('configurationPageFeatures.publish'),
            }),
          );
        })
        .catch(() => {
          dispatch(
            addNotification({
              message: t('configurationPageFeatures.agentConfigNotUpdated'),
              type: 'error',
              title: t('configurationPageFeatures.publish'),
            }),
          );
        });
    }
  };

  const handleClickPublish = async () => {
    if (!botId) return;
    const tabActions: { [key: string]: () => Promise<void> } = {
      agentConfiguration: updateAgentConfig,
      schema: updateSchema,
    };

    const updateAction = tabActions[activeTab];

    if (updateAction) {
      await updateAction();
    }

    dispatch(fetchConfig(botId));
    connectSocket();
  };

  // region chat bot widget
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const handleClickRunBot = async () => {
    // disable bot
    if (confHookData.isChatBotWidgetVisible) {
      // if (!chatId) return logger.error(`handleClickRunBot() => chatId not found`);
      setMessages([]);
      // socketRef.current?.send(JSON.stringify({ event: 'stop', message: botId, botId: botId, chatId: chatId }));
      await dispatch(setChatIsOpened(false));
      confHookData.setIsChatBotWidgetVisible(false);
    } else {
      setChatId(v4());
      // enable bot
      // connectSocket();
      await dispatch(setChatIsOpened(true));
      confHookData.setIsChatBotWidgetVisible(true);
      dispatch(setShowEditWindow(false));
    }
  };

  useEffect(() => {
    setMessages([]);
  }, [botId, confHookData.isChatBotWidgetVisible]);

  // endregion

  const { wsSend, connectSocket } = useSocket({
    url: REFRESH_BOT,
    initOnLoad: false,
    onClose: () => {
      logger.debug('WebSocket connection closed');
    },
    onOpen: () => {
      sendWebSocketRequest('refresh_bot', botId);
    },
    onError: () => {},
    onConnect: () => {
      logger.debug(`WebSocket connected to ${REFRESH_BOT}`);
    },
    onMessage: () => {},
  });
  const sendWebSocketRequest = (event: string, data: any) => {
    wsSend({
      event,
      userId: userInfo?.id,
      botId: data,
    });
  };

  return (
    <div className={styles.mainWrapper} style={{ height: '100%', width: '100%' }}>
      {confHookData.isLoading && <Loader type={'full-page'} />}
      {/*{isChatBotWidgetVisible && !isDialogOpen && <ChatBotWidget onClick={() => setIsDialogOpen(!isDialogOpen)} />}*/}

      {botId && confHookData.isChatBotWidgetVisible && chatId && (
        <ChatBotDialog
          setMessages={setMessages}
          chatId={chatId}
          botId={botId}
          clearHistory={() => setMessages([])}
          onClose={() => {
            setMessages([]);
            confHookData.setIsChatBotWidgetVisible(false);
          }}
          onHide={() => {
            confHookData.setIsChatBotWidgetVisible(false);
          }}
          messages={messages}
          onSendMessage={(msg) => setMessages((prev) => [...prev, msg])}
        />
      )}

      {confHookData.config.bot && (
        <SideBar
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          btnRunBot={{
            onClick: handleClickRunBot,
            chatIsOpened: confHookData.isChatBotWidgetVisible,
            isLoading: false,
          }}
          botName={confHookData.config.bot.name}
          botId={botId}
        />
      )}
      <div className={styles.content}>
        {activeTab === 'agentConfiguration' && (
          <TemplateConfiguration data={config} classNames={styles.agentConfiguration} />
        )}
        {activeTab === 'searchTest' && <SearchTest style={{ paddingTop: '120px', height: `calc(100% - 120px)` }} />}
        {/* {activeTab === 'schema' && <Schema botId={botId} data={config} confHookData={confHookData} />} */}
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          onClick={handleClickPublish}
          label={t('configurationPageFeatures.publish')}
          style={{ height: '48px' }}
          disabled={!(config.changesExist || confHookData.changesExist)}
        />
      </div>
    </div>
  );
};
