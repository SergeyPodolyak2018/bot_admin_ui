import { useCallback, useEffect, useState } from 'react';
import { TConfig } from 'types';
import { CallConfig } from './index.ts';
import { Loader, SquareTabs } from '../../common/index.ts';
import { ChatWidgetSettings } from './ChatWidget/ChatWidgetSettings.tsx';
import { BlockerFunction, useBlocker } from 'react-router-dom';
import { ConfirmModalUniversal } from '../common/index.ts';
import useStateRef from 'react-usestateref';

type TProps = {
  data: TConfig;
};

type ActiveTab = 'chat' | 'call';
export const PublishTabs = ({ data }: TProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [loading, setLoading] = useState(true);
  const [, setConfirmRouteWindow] = useStateRef(false);

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      return !!data.changesExist && currentLocation.pathname !== nextLocation.pathname;
    },
    [data.changesExist],
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (data.bot) {
      setLoading(false);
    }
  }, [data.bot]);

  return (
    <>
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
      {loading && <Loader type={'full-page'} />}
      {data.bot && (
        <>
          <div style={{ flex: 'none', marginTop: '1rem' }}>
            <SquareTabs
              tabs={[
                {
                  label: 'Chat',
                  name: 'chat',
                },
                {
                  label: 'Call',
                  name: 'call',
                },
              ]}
              onClick={(name: string) => {
                setActiveTab(name as ActiveTab);
              }}
              active={activeTab}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto', paddingBottom: '30px' }}>
            {activeTab === 'chat' && <ChatWidgetSettings data={data} />}
            {activeTab === 'call' && <CallConfig bot={data.bot!} />}
          </div>
        </>
      )}
    </>
  );
};
