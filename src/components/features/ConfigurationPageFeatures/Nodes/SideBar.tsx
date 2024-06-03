import { Tabs } from 'components/common';
import { VoiceChat } from 'components/features';
import { Dispatch, DragEvent, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';
import { ButtonIcon } from '../../../common/ButtonIcon/ButtonIcon';
import styles from './SideBar.module.scss';

type TSideBarProps = {
  btnRunBot?: {
    chatIsOpened: boolean;
    onClick: () => void;
    isLoading: boolean;
  };
  botId: string | number | undefined;
  botName?: string;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  // hangePage: (page: TpageViewType) => void;
};

export const SideBar = ({ botName, botId, btnRunBot, setActiveTab, activeTab }: TSideBarProps) => {
  const { t } = useTranslation();
  // const [vidgetType, setVidgetType] = useState<'chat' | 'voice'>('chat');
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.subwrapper} ${styles.botname}`}>
        <div style={{ marginLeft: '30px' }}>{botName}</div>
      </div>
      <div className={`${styles.subwrapper}`}>
        <Tabs
          classNames={styles.tabs}
          tabs={[
            {
              label: t('configurationPageFeatures.agentConfiguration'),
              name: 'agentConfiguration',
              onClick: (name) => setActiveTab(name),
            },
            {
              label: t('configurationPageFeatures.schema'),
              name: 'schema',
              onClick: (name) => setActiveTab(name),
            },
            {
              label: t('configurationPageFeatures.searchTest'),
              name: 'searchTest',
              onClick: (name) => setActiveTab(name),
            },
          ]}
          active={activeTab}
          style={{ height: '48px', width: '165px' }}
        />
        <div className={styles.buttonHolder}>
          {btnRunBot && botId && (
            <VoiceChat
              chatIsOpened={btnRunBot.chatIsOpened}
              botId={botId}
              callBack={() => {
                btnRunBot.onClick();
              }}
              isLoading={btnRunBot.isLoading}
              blocker={false}
              skipBlock={true}
              blockerCallback={() => {}}
              voiceStart={false}
              resetSkip={() => {}}
              resetVoice={() => {}}
            />
          )}
        </div>
      </div>

      {activeTab === 'schema' && (
        <div className={styles.subwrapper}>
          <>
            <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'file')} draggable>
              <ButtonIcon
                label={t('configurationPageFeatures.file')}
                style={{ height: '100%', width: '100%' }}
                icon="/dragable.svg"
              />
              {/* <TextSnippetIcon />
        File */}
            </div>

            <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'promt')} draggable>
              <ButtonIcon
                label={t('configurationPageFeatures.prompt')}
                style={{ height: '100%', width: '100%' }}
                icon="/dragable.svg"
              />
            </div>
            <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'category')} draggable>
              <ButtonIcon
                label={t('configurationPageFeatures.category')}
                style={{ height: '100%', width: '100%' }}
                icon="/dragable.svg"
              />
            </div>
          </>
        </div>
      )}
    </div>
  );
};
