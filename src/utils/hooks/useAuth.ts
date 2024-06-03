import { NavigationEnum } from 'navigation';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUser, selectUserAuth, selectUserLoading, useAppDispatch, useAppSelector, setOrganisations } from 'store';
import { fetchOrganisations } from 'store/organisations';
import { TOrganisation } from 'types';
import logger from 'utils/logger.ts';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  // const organisations = useAppSelector(selectOrganisationsState);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = useAppSelector(selectUserAuth);
  const isUserLoading = useAppSelector(selectUserLoading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (
      !isAuth &&
      !isUserLoading &&
      location.pathname !== NavigationEnum.LOGIN &&
      location.pathname !== NavigationEnum.SIGN_UP
    ) {
      navigate(NavigationEnum.LOGIN);
    } else if (
      isAuth &&
      !isUserLoading &&
      (location.pathname === NavigationEnum.ROOT ||
        location.pathname === `${NavigationEnum.ROOT}/` ||
        location.pathname === `${NavigationEnum.LOGIN}` ||
        location.pathname === `${NavigationEnum.SIGN_UP}`)
    ) {
      dispatch(fetchOrganisations()).then((data: any) => {
        if (data.payload?.length !== 0) {
          navigate(NavigationEnum.AI_AGENT);
        } else {
          logger.info('Organizations empty REDIRECT');
          navigate(NavigationEnum.ORGANISATIONS);
        }
      });
    }
  }, [isAuth, isUserLoading, location, navigate]);
};
