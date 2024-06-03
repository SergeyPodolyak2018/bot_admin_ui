import { Loader } from 'components/common';

import { GroupTemplateCard } from 'components/features';
import { PageHeader } from 'components/features/common/MainLayout/PageHeader';
import { NavigationEnum } from 'navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate, useParams } from 'react-router-dom';
import { createBotByTemplate, getTemplatesByType } from 'services/api';
import { addNotification, selectOrg, selectOrganisationsState, useAppDispatch, useAppSelector } from 'store';
import { TTemplate } from 'types';
import logger from 'utils/logger';
import styles from './groupTemplate.module.scss';

export const GroupTemplate = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const organisations = useAppSelector(selectOrganisationsState);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<TTemplate[]>([]);
  const [confirmWindow, setConfirmWindow] = useState(false);
  const [templateId, setTemplateId] = useState(-1);
  const [orgId, setOrgId] = useState(-1);
  const selectedOrganization = useAppSelector(selectOrg);

  useEffect(() => {
    if (template.length === 0 && !isNaN(Number(groupId))) {
      getTemplatesByType(Number(groupId)).then((data) => {
        setTemplate(data.data);
        setLoading(false);
      });
    }
  }, []);

  // useEffect(() => {
  //   console.log(selectedOrganization);
  //   if (organisations.data.length && selectedOrganization) {
  //     setOrgId(+selectedOrganization?.value);
  //   }
  // }, [organisations.data]);

  useEffect(() => {
    if (selectedOrganization) {
      setOrgId(+selectedOrganization?.value);
    }
  }, [selectedOrganization]);

  const createBot = (currentTemplateId: number) => {
    setLoading(true);
    createBotByTemplate({ templateId: currentTemplateId, organizationId: orgId })
      .then((data) => {
        navigate(`${NavigationEnum.AI_AGENT_CONFIG}/${data.data.id}`);
      })
      .catch((e: any) => {
        const message = e.response?.data?.message ? e.response.data.message : e.message;
        dispatch(addNotification({ title: 'Error to create Agent from template', type: 'error', message: message }));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const openCreateBotConfirm = (id: number) => {
    setTemplateId(id);
    setConfirmWindow(true);
  };
  const closeCreateBotConfirm = () => {
    setTemplateId(-1);
    setOrgId(organisations.data?.length ? organisations.data[0].id : -1);
    setConfirmWindow(false);
  };
  // const selectOrg = (e: SelectChangeEvent<number>) => {
  //   setOrgId(Number(e.target.value));
  // };

  useEffect(() => {
    logger.debug('This is group id', groupId);

    setLoading(false);
  }, [groupId]);

  return (
    <>
      <PageHeader
        title={'Templates'}
        subtitle={'Use ready-made bots from our templates for your field of activity.'}
        onClickBack={() => navigate(NavigationEnum.AI_AGENT_TEMPLATE)}
      />
      <div className={styles.container}>
        {loading ? (
          <Loader type={'full-page'} />
        ) : (
          <div className={styles.template_holder}>
            {template.map((el, index) => (
              <GroupTemplateCard
                key={index}
                text={el.description}
                header={el.bot.name}
                use={() => {
                  createBot(el.id);
                }}
                active={el.isActive}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
