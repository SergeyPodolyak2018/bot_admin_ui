import Avatar from '@mui/material/Avatar';
import { NavigationEnum } from 'navigation';
import { stringAvatar } from 'pages/OrganisationsPage/utils.ts';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { logout } from 'services/api';
import { localStorageSetItem } from 'services/localStorage';
import { selectUser, selectUserAuth, selectUserLoading, setAuthorized, useAppDispatch, useAppSelector } from 'store';
import phone from '../../../../assets/svg/landing/call.svg';
import mail from '../../../../assets/svg/landing/postIcon.svg';
import { Button } from '../Button/Button';

import styles from './header.module.scss';

interface IHeaderProps {
  parentRef: any;
}

export const Header = (props: IHeaderProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const isAuth = useAppSelector(selectUserAuth);
  const isUserLoading = useAppSelector(selectUserLoading);
  const user = useAppSelector(selectUser);
  const menuRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollToRef = (ref: any, offset: number) => {
    const scrollContainer = props.parentRef.current;
    const refRect = ref.getBoundingClientRect();

    const top = refRect.top + scrollContainer.scrollTop - scrollContainer.getBoundingClientRect().top;

    scrollContainer.scrollTo({ top, behavior: 'smooth' });
  };

  const handleLinkClick = (containerName: string, offset: number) => {
    const containerRef = document.getElementById(containerName);
    scrollToRef(containerRef, offset);
  };
  const handleClickLogout = async () => {
    await logout().then(() => {
      localStorageSetItem('accessToken', null);
      dispatch(setAuthorized(false));
    });
  };
  if (isUserLoading) return <></>;

  return (
    <nav ref={menuRef} className={`${styles.container} ${isOpen ? styles.active : ''}`}>
      <div className={styles.contentHolder}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link style={{ textWrap: 'nowrap' }} to={'/'}>
              {t('header.title')}
            </Link>
          </div>
          <div className={`${styles.navbarContainer} ${isOpen ? styles.activate : ''}`}>
            <div className={styles.contactsContainer}>
              <ul className={styles.contactsList}>
                <li className={styles.contactItem}>
                  <img src={phone} alt={'hand'}></img>
                  <a href="tel:+15304365280">+1 530 436 5280</a>
                </li>
                <li className={styles.contactItem}>
                  <img src={mail} alt={'hand'}></img>
                  <a href="mailto:contact@BOT.ai">contact@BOT.ai</a>
                </li>
              </ul>
            </div>
            <ul className={styles.navbar}>
              <li className={styles.navItem}>
                <div className={styles.link} onClick={() => handleLinkClick('priceSectionContainer', 200)}>
                  {t('landingPageFeatures.header.pricing')}
                </div>
              </li>
              {!isAuth ? (
                <>
                  <li className={styles.navItem}>
                    <Link className={styles.link} to={NavigationEnum.LOGIN}>
                      {t('landingPageFeatures.header.signIn')}
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    {isOpen ? (
                      <Link className={styles.link} to={NavigationEnum.SIGN_UP}>
                        {t('landingPageFeatures.header.signUp')}
                      </Link>
                    ) : (
                      <Link to={NavigationEnum.SIGN_UP}>
                        <Button
                          style={{
                            fontWeight: 600,
                            fontSize: '18px',
                          }}
                          label={t('landingPageFeatures.header.signUp')}
                        />
                      </Link>
                    )}
                  </li>
                </>
              ) : (
                <>
                  <li className={styles.navItem__avatar}>
                    <div className={styles.link} onClick={handleClickLogout}>
                      {t('landingPageFeatures.header.logout')}
                    </div>
                  </li>
                  <li className={styles.navItem__avatar}>
                    <Link to={NavigationEnum.AI_AGENT}>
                      <Avatar {...stringAvatar(user ? user.email : '', '#000')} sx={{ width: 50, height: 50 }} />
                    </Link>

                    {/*<Button*/}
                    {/*  style={{*/}
                    {/*    padding: '18px, 32px, 18px, 32px',*/}
                    {/*    fontWeight: 700,*/}
                    {/*    fontSize: '18px',*/}
                    {/*    height: '44px',*/}
                    {/*    width: '150px',*/}
                    {/*  }}*/}

                    {/*  label="SIGN IN"*/}
                    {/*/>*/}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.burgerContainer}>
          <div className={`${styles['burger-menu']} ${isOpen ? styles.open : ''}`} onClick={toggleMenu}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
