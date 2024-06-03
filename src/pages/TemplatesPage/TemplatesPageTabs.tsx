import { SquareTabs } from 'components/common';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectUser, useAppSelector } from 'store';
import styles from './templates.module.scss';

import { TemplatesPage } from './TemplatesPage.tsx';
import { TemplatesTypesPage } from './TemplatesTypesPage.tsx';

export const TemplatesPageTabs = () => {
  const { hash } = useLocation();
  const tab = hash.replace('#', '') === 'types' ? 'types' : 'templates';
  const [selectedTab, setSelectedTab] = useState(tab);
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const [show, setShow] = useState(!!(user && user.role));

  useEffect(() => {
    setShow(!!(user && user.role));
  }, [user]);

  useEffect(() => {
    if (!hash) navigate('#templates');
  }, []);

  return (
    show && (
      <div className={styles.container}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <SquareTabs
            tabs={[
              {
                label: 'Templates',
                name: 'templates',
              },
              {
                label: 'Categories',
                name: 'types',
              },
            ]}
            onClick={(name: string) => {
              setSelectedTab(name);
              navigate(`#${name}`);
            }}
            active={selectedTab}
            style={{ height: '48px', width: '165px' }}
          />

          <div className={styles.template_holder}>
            {selectedTab === 'templates' && <TemplatesPage />}
            {selectedTab === 'types' && <TemplatesTypesPage />}
          </div>
        </div>
      </div>
    )
  );
};
