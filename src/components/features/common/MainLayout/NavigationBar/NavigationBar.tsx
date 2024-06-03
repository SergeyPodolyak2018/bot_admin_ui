import { useLocation, useNavigate } from 'react-router-dom';
import {
  isSideMenuOpen,
  selectOrganisations,
  selectUserAuth,
  setSideMenuOpen,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { NAVIGATION_LIST } from '../../../../../assets/svg/constants.ts';
import { NavBarHeader } from './NavBarHeader/index.ts';
import { NavButton } from './NavButton/index.ts';
import styles from './NavigationBar.module.scss';
import { useState } from 'react';

export const NavigationBar = () => {
  const { pathname: currentLocation } = useLocation();
  const userIsAuth = useAppSelector(selectUserAuth);
  const organisations = useAppSelector(selectOrganisations);
  const dispatch = useAppDispatch();
  //const userInfo = useAppSelector(selectUser);
  const navigate = useNavigate();
  const navigator = (url: string) => {
    navigate(url);
    dispatch(setSideMenuOpen(false));
  };
  const isSlideMenuOpen = useAppSelector(isSideMenuOpen);

  return (
    <div className={`${styles.Navbar} ${isSlideMenuOpen ? styles['Navbar--open'] : ''}`}>
      {/* Стандартные кнопки, отображаются, если не в режиме бургера */}
      <div className={styles.Navbar__btns}>
        <NavBarHeader />
        {NAVIGATION_LIST.map((element, i) => (
          <NavButton
            key={i}
            click={navigator}
            urlCurrent={currentLocation}
            urlTarget={element.link}
            innerText={element.title}
            icon={element.icon}
            entity={element.entity}
            privileges={element.privileges}
            disabled={userIsAuth && organisations.length === 0 && element.title !== 'Organizations'}
          />
        ))}
      </div>

      <div className={styles['Navbar--open']}>
        <NavBarHeader />
        {NAVIGATION_LIST.map((element, i) => (
          <NavButton
            key={i}
            click={navigator}
            urlCurrent={currentLocation}
            urlTarget={element.link}
            innerText={element.title}
            icon={element.icon}
            entity={element.entity}
            privileges={element.privileges}
            disabled={userIsAuth && organisations.length === 0 && element.title !== 'Organizations'}
          />
        ))}
      </div>
    </div>
  );
};
