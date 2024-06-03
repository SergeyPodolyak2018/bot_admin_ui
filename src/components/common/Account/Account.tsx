import Avatar from '@mui/material/Avatar';
import { IAccountProps } from 'components/common/Account/Account.types.ts';
import { NavigationEnum } from 'navigation';
import { stringAvatar } from 'pages/OrganisationsPage/utils';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { localStorageClear, localStorageSetItem } from 'services';
import { logout } from 'services/api';
import { selectUser, setAuthorized, setSideMenuOpen, useAppDispatch, useAppSelector } from 'store';
import { useClickOutside } from 'utils/hooks';
import s from './Account.module.scss';
import LogoutIcon from './logoutIcon.svg?react';
import { useRef } from 'react';
import ProfileIcon from './profileIcon.svg?react';
import { setSelectedOrg } from 'store';

export const Account: FC<IAccountProps> = ({ style = {} }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectUser);

  const [avatarSrc, setAvatarSrc] = useState<any>(null);
  const [accountProfileOpen, setAccountProfileOpen] = useState(false);

  function useClickOutsideSome(refs: any, cb: () => void) {
    const handleClickOutside = (event: any) => {
      const isOutside = refs.every((ref: any) => {
        return ref.current && !ref.current.contains(event.target);
      });
      if (isOutside) {
        dispatch(setSideMenuOpen(false));
        cb();
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [refs]);

    return refs;
  }

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useClickOutsideSome([ref1, ref2], () => setAccountProfileOpen(false));

  useEffect(() => {
    if (data) {
      if (data.avatar) {
        setAvatarSrc({ src: `data:${data.avatarMime};base64,${data!.avatar}` });
      } else {
        setAvatarSrc(stringAvatar(data.email));
      }
    }
  }, [data]);

  useEffect(() => {}, []);

  const handleClickLogout = () => {
    logout().then(() => {
      dispatch(setSelectedOrg(null));
      localStorage.removeItem('selectedOrg');
      localStorageSetItem('accessToken', null);
      dispatch(setAuthorized(false));
    });
  };

  const navigateToProfile = () => {
    setAccountProfileOpen(false);
    navigate(NavigationEnum.PROFILE);
  };

  const toggleAccountProfile = () => {
    setAccountProfileOpen(!accountProfileOpen);
  };

  return (
    <div className={s.Account}>
      {avatarSrc && (
        <div className={s.Account__avatar} onClick={toggleAccountProfile} ref={ref1}>
          <Avatar {...avatarSrc} sx={{ width: 50, height: 50, cursor: 'pointer', ...style }} />
          <span className={s.Account__arrowIcon}></span>
        </div>
      )}
      {accountProfileOpen && (
        <div className={s.dropdown} ref={ref2}>
          <div className={s.dropdown__option} onClick={navigateToProfile}>
            <ProfileIcon /> Profile
          </div>
          <div className={s.dropdown__option} onClick={handleClickLogout}>
            <LogoutIcon /> {t('account.logout')}
          </div>
        </div>
      )}
    </div>
  );
};
