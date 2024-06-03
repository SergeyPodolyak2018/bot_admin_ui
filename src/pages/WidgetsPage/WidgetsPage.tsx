import { PublishTabs } from 'components/features/WidgetsFuture/PublishTabs.tsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateBot } from 'services';
import { addNotification, fetchConfig, fetchOrganisations, getConfig, resetConfig } from 'store';
import { useAppDispatch, useAppSelector } from 'store/store.hooks.ts';
import { Button as TryItNowButton } from '../../components/common';
import styles from './widgets.module.scss';

export const WidgetsPage = () => {
  const dispatch = useAppDispatch();
  const { botId } = useParams();
  const config = useAppSelector(getConfig);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   console.log('find me');
  //   if (config.bot) {
  //     setLoading(false);
  //   }
  // }, [config.bot]);
  useEffect(() => {
    if (!botId) return;
    dispatch(resetConfig());
    dispatch(fetchOrganisations())
      .then(() => {
        dispatch(fetchConfig(botId));
      })
      .then(() => {
        setLoading(false);
      });
  }, [botId]);

  // useConfiguration({ botId });

  const getFormData = (data: any): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      //@ts-expect-error: Temp solution
      formData.append(key, value);
    });
    return formData;
  };
  const handleSubmit = () => {
    if (config.bot!.changed) {
      const item = {
        recordId: config.bot!.recordId,
        widgetDesign: config.bot!.widgetDesign,
      } as any;

      if (config.bot!.widgetLogo instanceof Blob) {
        item.widgetLogo = config.bot!.widgetLogo;
      }

      const formData = getFormData(item);
      setLoading(true);
      updateBot(formData, config.bot!.id).then(() => {
        dispatch(fetchConfig(config!.bot!.id as string)).then(() => {
          setLoading(false);
          dispatch(addNotification({ type: 'success', title: 'Saved Successfully', message: '' }));
        });
      });
    }
  };

  const button = () => {
    return (
      <TryItNowButton
        label={'Save'}
        style={{ height: '28px', marginLeft: 'auto', marginRight: '20px', width: '130px' }}
        onClick={handleSubmit}
        disabled={!config.bot!.changed}
      />
    );
  };

  return (
    <div className={styles.container}>
      <PublishTabs data={config} />
      <div style={{ paddingTop: 10, paddingBottom: 10 }}>{config.bot && button()}</div>
    </div>
  );
};
