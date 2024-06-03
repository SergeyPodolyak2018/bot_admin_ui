import { Loader } from 'components/common';
import { BotTemplateCard } from 'components/features';
import { PageHeader } from 'components/features/common/MainLayout/PageHeader';
import { NavigationEnum } from 'navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getTemplateTypes } from 'services/api';
import { fetchOrganisations, selectOrganisations, useAppDispatch, useAppSelector } from 'store';
import { TTemplateTypesUI } from 'types';
import styles from './callList.module.scss';

export const BotTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groupTemplates, setGroupTemplates] = useState<TTemplateTypesUI[]>([]);
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganisations);

  const openTemplates = (id: number) => {
    navigate(`${NavigationEnum.AI_AGENT_TEMPLATE}/${id}`);
  };
  useEffect(() => {
    if (!organizations.length) dispatch(fetchOrganisations());
  }, []);
  useEffect(() => {
    if (groupTemplates.length === 0) {
      getTemplateTypes().then((data) => {
        //console.log(newData);
        setGroupTemplates(data.data);
        setLoading(false);
      });
    }
  }, []);

  return (
    <>
      <PageHeader
        title={'Templates'}
        subtitle={'Use ready-made bots from our templates for your field of activity.'}
        onClickBack={() => navigate(NavigationEnum.AI_AGENT)}
      />
      <div className={styles.container}>
        {loading ? (
          <Loader type={'full-page'} />
        ) : (
          <div className={styles.template_holder}>
            {groupTemplates.map((el) => (
              <BotTemplateCard
                key={el.id}
                header={el.name}
                img={el.image}
                text={el.description}
                cklick={() => openTemplates(el.id)}
                active={el.templateCount > 0}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
