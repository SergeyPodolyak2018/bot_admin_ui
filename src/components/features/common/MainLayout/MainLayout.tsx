import { NavigationBar } from 'components/features';
import { PageHeader } from 'components/features/common/MainLayout/PageHeader';
import { pageHeaderContent } from 'components/features/common/MainLayout/PageHeader/PageHeader.constants.ts';
import { NavigationEnum } from 'navigation';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchOrganisations,
  selectUser,
  selectUserLoading,
  useAppDispatch,
  useAppSelector,
  resetInteractions,
} from 'store';
import styles from './MainLayout.module.scss';
import './Navbar.var.scss';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUser);
  const userIsLoading = useAppSelector(selectUserLoading);

  useEffect(() => {
    if (!userInfo?.organizations?.length && !userIsLoading) {
      if (!location.pathname.includes(NavigationEnum.PROFILE)) {
        navigate(NavigationEnum.ORGANISATIONS);
      }
    }
    if (!location.pathname.includes(NavigationEnum.INTERACTIONS)) {
      dispatch(resetInteractions());
    }
  }, [userIsLoading, location.pathname]);

  useEffect(() => {
    dispatch(fetchOrganisations());
  }, []);

  const content = useMemo(() => {
    for (const key in pageHeaderContent) {
      const regex = new RegExp(`^${key.replace(/:[^/]+/g, '[^/]+')}$`);
      if (regex.test(location.pathname)) {
        return pageHeaderContent[key];
      }
    }
  }, [location]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <NavigationBar />
        <div className={styles.container_content}>
          {content && <PageHeader title={content.title} subtitle={content.subtitle} />}
          <>{children}</>
        </div>
      </div>
    </div>
  );
};
