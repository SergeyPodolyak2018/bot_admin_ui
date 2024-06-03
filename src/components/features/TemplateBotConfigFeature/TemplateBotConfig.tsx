import { Button as TryItNowButton, EmptyPlaceholder, Loader, Tabs } from 'components/common';
import { ConfirmModalUniversal } from 'components/features/common/ConfirmationModalUniversal/ConfirmModalUniversal';
import { PageHeader } from 'components/features/common/MainLayout/PageHeader';
import { SearchTest } from 'components/features/TemplateBotConfigFeature/SearchTest';
import { NavigationEnum } from 'navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockerFunction, useBlocker, useParams } from 'react-router-dom';
import useStateRef from 'react-usestateref';

import {
  assignPhoneNumber,
  deleteCategore,
  deleteFiles,
  deletePromptById,
  postFiles,
  postPrompt,
  putCategore,
  putFiles,
  putPromptById,
  REFRESH_BOT,
  updateBot,
} from 'services/api';
import {
  addNotification,
  fetchConfig,
  getConfig,
  getConfigOrganizationId,
  selectedBotSelector,
  selectExpertMode,
  selectOrganisations,
  selectUser,
  setChatIsOpened,
  setSelectedOrg,
  setShowEditWindow,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { BotFull } from 'types';
import { categoryForUpdate, checkFields } from 'utils/botUtils.ts';
import { useSocket } from 'utils/hooks/useSocket';
import logger from 'utils/logger.ts';
import {
  categoryPartialPayloadPut,
  checkBelongFileToCategory,
  checkBelongPromptToCategory,
  createChainFunc,
  createPartialChainFunc,
  getFilePayload,
  getPromptPayload,
} from 'utils/template';
import { v4 } from 'uuid';

import { ChatBotDialog, ChatMessage, Schema, VoiceChat } from '..';
import { useConfiguration } from '../ConfigurationPageFeatures';
import { TemplateConfiguration } from './Configuration';
import { KnowldgeBase } from './KnowldgeBase';
import styles from './templateBotConfig.module.scss';

export const TemplateBotConfig = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { botId } = useParams();
  const userInfo = useAppSelector(selectUser);
  const isExpertMode = useAppSelector(selectExpertMode);

  const currentBotId = useAppSelector(selectedBotSelector);
  const config = useAppSelector(getConfig);

  const [loading, setLoading] = useState(false);
  const [confirmWindow, setConfirmWindow] = useState(false);
  const [, setConfirmRouteWindow] = useStateRef(false);
  const [vidgetType, setVidgetType] = useState<'chat' | 'voice'>('chat');
  const [voiceRunning, setVoiceRunning] = useState(false);
  const [skipSave, setSkipSave] = useState(false);
  const [activetab, setActiveTab] = useState('agentConfiguration');
  const [newId, setNewId] = useState(-1);
  const [initPhoneNumber, setInitPhoneNumber] = useState(config.phone || '');
  const selectedConfigOrgId = useAppSelector(getConfigOrganizationId);
  const organizations = useAppSelector(selectOrganisations);

  useEffect(() => {
    setInitPhoneNumber(config.phone || '');
  }, [config.bot?.id]);

  const confHookData = useConfiguration({ botId });

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      return !!config.changesExist && currentLocation.pathname !== nextLocation.pathname;
    },
    [config.changesExist],
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    return () => {
      confHookData.setIsChatBotWidgetVisible(false);
    };
  }, []);

  const getFormData = (data: any): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      //@ts-expect-error: Temp solution
      formData.append(key, value);
    });
    return formData;
  };

  const SERVER_URL = REFRESH_BOT;
  const { wsSend, connectSocket } = useSocket({
    url: SERVER_URL,
    initOnLoad: false,
    onClose: () => {
      logger.debug('WebSocket connection closed');
    },
    onOpen: () => {
      sendWebSocketRequest('refresh_bot', botId);
      logger.debug('WebSocket connection opened');
    },
    onError: (msg) => {
      // let msgInternal = msg;
      // if (typeof msgInternal !== 'string') {
      //   msgInternal = String(msgInternal);
      // }
      dispatch(addNotification({ type: 'error', title: 'Refresh bot error', message: msg.message }));
    },
    onConnect: () => {
      logger.debug(`WebSocket connected to ${SERVER_URL}`);
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

  const updateDesign = () => {
    const result = categoryForUpdate(confHookData.categories, confHookData.nodes, confHookData.edges);
    const promiseContainer = [];
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
      promiseContainer.push(putCategore(iterator.id as number, iterator));
    }
    Promise.allSettled(promiseContainer)
      .then(() => {
        dispatch(
          addNotification({
            message: '',
            type: 'success',
            title: t('configurationPageFeatures.publish'),
          }),
        );
      })
      .catch(() => {
        dispatch(
          addNotification({
            message: '',
            type: 'error',
            title: t('configurationPageFeatures.publish'),
          }),
        );
      });

    dispatch(fetchConfig(config?.bot?.id as string)).then(() => {
      setLoading(false);
      connectSocket();
    });
  };

  const publish = async (calback?: () => void) => {
    // if (activetab === 'schema') {
    //   updateDesign();
    //   return;
    // }
    const promiseStorage = [];
    if (config.bot?.changed) {
      if (initPhoneNumber !== config.phone) {
        await assignPhoneNumber({ phone: config.phone, recordId: config.bot.recordId });
        setInitPhoneNumber(config.phone);
      }
      const message = checkFields('bot', 'greeting', config.bot.greeting);
      if (message) {
        dispatch(addNotification({ type: 'error', title: 'Field Error', message: message }));
        return;
      }

      const item = {
        name: config.bot.name,
        organizationId: config.bot.organization.id,
        greeting: config.bot.greeting,
        useContext: config.bot.useContext,
        useHistory: config.bot.useHistory,
        useRemarks: config.bot.useRemarks,
        botPrompt: config.bot.botPrompt,
        recordId: config.bot.recordId,
        widgetDesign: config.bot.widgetDesign,
        llmModelId: config.bot.llmModelId,
        // phone: config.bot.phone,
      } as any;
      if (config.bot.widgetLogo instanceof Blob) {
        item.widgetLogo = config.bot.widgetLogo;
      }
      const data = getFormData(item);
      promiseStorage.push(async () => updateBot(data, config?.bot?.id!));
    }
    for (const iterator of config.files) {
      if (iterator.changed) {
        if (iterator.id > 0) {
          if (iterator.deleted) {
            promiseStorage.push(async () => deleteFiles(iterator.id));
          } else {
            const blob = new Blob([iterator.file.data], {
              type: 'text/plain',
            });
            const formData = new FormData();
            //TODO Uncomment when will implement
            // if (iterator.extension === 'csv') {
            // }
            formData.set('file', blob);
            promiseStorage.push(async () => putFiles(formData, iterator.id));
            formData.set('extension', iterator.extension);
          }
        } else {
          if (!iterator.deleted && !checkBelongFileToCategory(config.categories, iterator.id)) {
            const filePaylad = getFilePayload(iterator, config?.bot?.recordId!);
            promiseStorage.push(async () => postFiles(filePaylad));
          }
        }
      }
    }
    for (const iterator of config.prompts) {
      if (iterator.changed) {
        if (iterator.id > 0) {
          if (iterator.deleted) {
            promiseStorage.push(async () => deletePromptById(iterator.id));
          } else {
            const payload = { text: iterator.text, name: iterator.name, isNoSource: iterator.isNoSource };
            promiseStorage.push(async () => putPromptById(iterator.id, payload));
          }
        } else {
          if (!iterator.deleted && !checkBelongPromptToCategory(config.categories, iterator.id)) {
            const promptPaylad = getPromptPayload(iterator, config?.bot?.recordId!);
            promiseStorage.push(async () => postPrompt(promptPaylad));
          }
        }
      }
    }
    for (const iterator of config.categories) {
      if (iterator.changed && iterator.id > 0 && iterator.deleted) {
        promiseStorage.push(async () => deleteCategore(iterator.id));
      } else if (iterator.changed && iterator.id > 0 && !iterator.deleted && !iterator.containeNonExist) {
        promiseStorage.push(async () => putCategore(iterator.id, categoryPartialPayloadPut(iterator)));
      } else if (iterator.changed && iterator.id < 0 && !iterator.deleted) {
        const file = config.files.find((el) => el.id === iterator.file?.id);
        const prompt = config.prompts.find((el) => el.id === iterator.prompt?.id);

        promiseStorage.push(async () => createChainFunc(iterator, prompt, file, config.bot!)());
      } else if (iterator.changed && iterator.id > 0 && !iterator.deleted && iterator.containeNonExist) {
        const file =
          iterator.file && iterator.file.id < 0 ? config.files.find((el) => el.id === iterator?.file?.id) : undefined;
        const prompt =
          iterator.prompt && iterator.prompt.id < 0
            ? config.prompts.find((el) => el.id === iterator?.prompt?.id)
            : undefined;
        if (file || prompt) {
          promiseStorage.push(createPartialChainFunc(config.bot!, iterator, prompt, file));
        }
      }
    }
    setLoading(true);
    for await (const iterator of promiseStorage) {
      if (typeof iterator === 'function') {
        await iterator().catch((err) => {
          console.log(err);
        });
      }
    }
    dispatch(fetchConfig(config?.bot?.id as string)).then((_data: any) => {
      const currentOrg = organizations.find((x) => x.id === selectedConfigOrgId);
      if (currentOrg) {
        const payload = {
          value: currentOrg?.id.toString(),
          label: currentOrg?.name,
        };
        dispatch(setSelectedOrg(payload));
        // console.log(payload, 'payload', selectedConfigOrgId);
        localStorage.setItem('selectedOrg', JSON.stringify(payload));
      }

      setLoading(false);
      dispatch(addNotification({ type: 'success', title: 'Saved Successfully', message: '' }));
      connectSocket();
      if (calback) {
        calback();
      }
    });

    // Promise.allSettled(promiseStorage).then(() => {
    //   dispatch(fetchConfig(config?.bot?.id as string)).then((_data: any) => {
    //     const currentOrg = organizations.find((x) => x.id === selectedConfigOrgId);
    //     if (currentOrg) {
    //       const payload = {
    //         value: currentOrg?.id.toString(),
    //         label: currentOrg?.name,
    //       };
    //       dispatch(setSelectedOrg(payload));
    //       // console.log(payload, 'payload', selectedConfigOrgId);
    //       localStorage.setItem('selectedOrg', JSON.stringify(payload));
    //     }

    //     setLoading(false);
    //     dispatch(addNotification({ type: 'success', title: 'Saved Successfully', message: '' }));
    //     connectSocket();
    //     if (calback) {
    //       calback();
    //     }
    //   });
    // });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const handleClickRunBot = async () => {
    confHookData.setIsChatBotWidgetHidden(false);
    // disable bot
    if (confHookData.isChatBotWidgetVisible) {
      // if (!chatId) return;
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
      setSkipSave(false);
    }
  };
  // const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
  //   event.dataTransfer.setData('application/reactflow', nodeType);
  //   event.dataTransfer.effectAllowed = 'move';
  // };

  const validate = (bot: BotFull) => {
    if (bot.botPrompt.length === 0) {
      return false;
    }
    if (bot.name.length === 0) {
      return false;
    }
    if (bot.greeting.length < 20) {
      return false;
    }
    return true;
  };

  if (confHookData.isAccessDenied) {
    return (
      <EmptyPlaceholder
        text={'You do not have access to this AI agent.'}
        icon={'lock'}
        link={`${NavigationEnum.AI_AGENT}`}
        style={{ maxWidth: '100%' }}
        title={'AI Agents'}
      />
    );
  }

  return (
    <div className={styles.container}>
      {
        <PageHeader
          classNames={styles.pageHeader}
          // onClickBack={() => navigate(NavigationEnum.AI_AGENT)}
          title={config.bot?.name || ''}
          subtitle={config.bot?.name ? 'Use our recommendations to create a high-quality agent.' : ''}
          component={
            <div className={styles.adaptiveButton}>
              <VoiceChat
                botId={currentBotId ? currentBotId.id.toString() : botId ? botId : ''}
                callBack={() => {
                  handleClickRunBot();
                }}
                isLoading={false}
                chatIsOpened={confHookData.isChatBotWidgetVisible}
                disabled={!config.categories.length}
                blocker={!!config.changesExist}
                blockerCallback={(type: 'chat' | 'voice') => {
                  setVidgetType(type);
                  setConfirmWindow(true);
                }}
                skipBlock={skipSave}
                resetSkip={() => {
                  setSkipSave(false);
                }}
                resetVoice={() => {
                  setVoiceRunning(false);
                }}
                voiceStart={voiceRunning}
              />
            </div>
          }
        />
      }
      {(confHookData.isLoading || loading) && <Loader type={'full-page'} />}
      {confirmWindow && (
        <ConfirmModalUniversal
          disableConfirm={false}
          confirm={() => {
            setConfirmRouteWindow(false);
            if (vidgetType === 'voice') {
              setVoiceRunning(true);
            } else {
              handleClickRunBot();
            }
            setSkipSave(true);
          }}
          confirmName={'Continue'}
          cancel={() => {
            setConfirmWindow(false);
          }}
          title={'Unsaved Changes'}>
          <span>You have made unsaved changes. Continue running the bot without these changes?</span>
        </ConfirmModalUniversal>
      )}
      {blocker.state === 'blocked' && (
        <ConfirmModalUniversal
          disableConfirm={false}
          confirm={() => {
            setConfirmRouteWindow(false);
            blocker.proceed?.();
          }}
          confirmName={'Continue'}
          cancelName={'Discard'}
          cancel={() => {
            setConfirmRouteWindow(false);
            blocker.reset?.();
          }}
          title={'Unsaved Changes'}>
          <span>You have made unsaved changes. Do you want to continue or discard?</span>
        </ConfirmModalUniversal>
      )}
      <div className={styles.contentContainer}>
        <div className={styles.headerContentContainer}>
          <div className={styles.headerContent}>
            <Tabs
              tabs={[
                {
                  label: t('TemplateBotConfig.agentConfiguration'),
                  name: 'agentConfiguration',
                  onClick: (name) => setActiveTab(name),
                },
                {
                  label: t('TemplateBotConfig.knowledgeBase'),
                  name: 'knowledgeBase',
                  onClick: (name) => setActiveTab(name),
                },
                {
                  label: t('TemplateBotConfig.searchTest'),
                  name: 'searchTest',
                  hidden: !isExpertMode,
                  onClick: (name) => setActiveTab(name),
                },
                {
                  label: t('TemplateBotConfig.schema'),
                  name: 'schema',
                  hidden: !isExpertMode,
                  onClick: (name) => setActiveTab(name),
                },
              ]}
              active={activetab}
            />
            <div className={styles.runBtn}>
              <div className={styles.buttonContainer}>
                <VoiceChat
                  botId={currentBotId ? currentBotId.id.toString() : botId ? botId : ''}
                  callBack={() => {
                    handleClickRunBot();
                  }}
                  disabled={!config.categories.length}
                  isLoading={false}
                  chatIsOpened={confHookData.isChatBotWidgetVisible}
                  blocker={!!config.changesExist}
                  blockerCallback={(type: 'chat' | 'voice') => {
                    setVidgetType(type);
                    setConfirmWindow(true);
                  }}
                  skipBlock={skipSave}
                  resetSkip={() => {
                    setSkipSave(false);
                  }}
                  resetVoice={() => {
                    setVoiceRunning(false);
                  }}
                  voiceStart={voiceRunning}
                />
              </div>
              {botId && confHookData.isChatBotWidgetVisible && chatId && (
                <ChatBotDialog
                  setMessages={setMessages}
                  chatId={chatId}
                  botId={botId}
                  onClose={() => {
                    confHookData.setIsChatBotWidgetVisible(false);
                    confHookData.setIsChatBotWidgetHidden(true);
                    setMessages([]);
                  }}
                  onHide={() => {
                    confHookData.setIsChatBotWidgetHidden(true);
                  }}
                  clearHistory={() => setMessages([])}
                  messages={messages}
                  onSendMessage={(msg) => setMessages((prev) => [...prev, msg])}
                />
              )}
            </div>
          </div>
          {activetab === 'schema' && (
            // <div className={styles.dndItems}>
            //   <>
            //     <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'file')} draggable>
            //       <ButtonIcon
            //         label={t('configurationPageFeatures.file')}
            //         style={{ height: '100%', width: '100%' }}
            //         icon="/dragable.svg"
            //       />
            //     </div>
            //     <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'promt')} draggable>
            //       <ButtonIcon
            //         label={t('configurationPageFeatures.prompt')}
            //         style={{ height: '100%', width: '100%' }}
            //         icon="/dragable.svg"
            //       />
            //     </div>
            //     <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'category')} draggable>
            //       <ButtonIcon
            //         label={t('configurationPageFeatures.category')}
            //         style={{ height: '100%', width: '100%' }}
            //         icon="/dragable.svg"
            //       />
            //     </div>
            //   </>
            // </div>
            <></>
          )}
        </div>

        <div
          className={`${activetab === 'schema' ? styles.template_schema_holder : styles.template_holder} ${
            activetab === 'knowledgeBase' ? styles.knowledgeBaseHolder : ''
          } ${activetab === 'schema' ? styles.schemaHolder : ''}`}>
          {activetab === 'agentConfiguration' && <TemplateConfiguration data={config} />}
          {activetab === 'knowledgeBase' && (
            <KnowldgeBase data={config} idSaver={{ newId: newId, iterate: setNewId }} loading={loading} />
          )}
          {activetab === 'searchTest' && <SearchTest />}
          {activetab === 'schema' && (
            <Schema
              botId={botId}
              data={config}
              idSaver={{ newId: newId, iterate: setNewId }}
              loading={loading}
              confHookData={confHookData}
            />
          )}
        </div>
        <div className={styles.saveButtonHolder}>
          {config.bot && (
            <TryItNowButton
              label={'Save'}
              onClick={publish}
              classNames={styles.saveButton}
              disabled={!validate(config.bot) || !config.changesExist}
            />
          )}
          <div className={styles.optionalRunAgentButton}>
            <VoiceChat
              botId={currentBotId ? currentBotId.id.toString() : botId ? botId : ''}
              callBack={() => {
                handleClickRunBot();
              }}
              disabled={!config.categories.length}
              isLoading={false}
              chatIsOpened={confHookData.isChatBotWidgetVisible}
              blocker={!!config.changesExist}
              blockerCallback={(type: 'chat' | 'voice') => {
                setVidgetType(type);
                setConfirmWindow(true);
              }}
              skipBlock={skipSave}
              resetSkip={() => {
                setSkipSave(false);
              }}
              resetVoice={() => {
                setVoiceRunning(false);
              }}
              voiceStart={voiceRunning}
              defaultButtonStyle
            />
          </div>
        </div>
      </div>
    </div>
  );
};
