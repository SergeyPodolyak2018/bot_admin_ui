import styles from 'components/features/common/MainLayout/NavigationBar/NavBarHeader/NavBarHeader.module.scss';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';

export const NavBarHeader = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Link to={'/'} className={styles.nameHolder}>
        {t('header.title')}
      </Link>
    </div>
  );
};
