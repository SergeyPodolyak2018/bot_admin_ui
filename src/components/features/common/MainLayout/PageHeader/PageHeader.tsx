import cx from 'classnames';
import { Account, Dropdown, IOption } from 'components/common';
import { PageHeaderButtons } from 'components/features/common/MainLayout/PageHeaderButtons';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';
import {
  isSideMenuOpen,
  selectOrg,
  selectOrganisations,
  selectOrgData,
  selectUser,
  setSelectedOrg,
  setSideMenuOpen,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { ClassNames } from 'types';
import { convertAmount } from 'utils/primitives/number';
import BurgerIcon from '../../../../../assets/svg/burger.svg';
import s from './PageHeader.module.scss';

export interface PageHeaderProps {
  onClickRefresh?: () => void;
  onClickBack?: () => void;
  title: string;
  subtitle: string;
  classNames?: ClassNames;
  component?: React.ReactNode;
}

export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  title,
  subtitle,
  children,
  onClickRefresh,
  onClickBack,
  classNames,
  component,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const organizations = useAppSelector(selectOrganisations);
  const selectedOrg = useAppSelector(selectOrg);
  const selectedOrgData = useAppSelector(selectOrgData);
  const user = useAppSelector(selectUser);
  // const [selectedOrg, setSelectedOrg] = useState<IOption | undefined>();
  const [orgDropdownOptions, setOrgDropdownOptions] = useState<IOption[]>([]);
  const isInAdminPath = /ai_agent_config\/[a-zA-Z0-9-]+/.test(location.pathname);
  const sideMenuOpen = useAppSelector(isSideMenuOpen);
  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLocalStorage = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };
  useEffect(() => {
    if (selectedOrg === null) {
      const storedOrg = getFromLocalStorage('selectedOrg');
      if (storedOrg) {
        dispatch(setSelectedOrg(storedOrg));
      } else {
        const options = organizations.map((org) => ({
          value: org.id.toString(),
          label: org.name,
        }));
        setOrgDropdownOptions(options);
        if (organizations.length) {
          const matchingOrg = organizations.find((org) => org.owner && org.owner.id === user?.id);
          const defaultOrg = matchingOrg
            ? { label: matchingOrg.name, value: matchingOrg.id.toString() }
            : {
                label: organizations[0].name,
                value: organizations[0].id.toString(),
              };

          saveToLocalStorage('selectedOrg', defaultOrg);
          dispatch(setSelectedOrg(defaultOrg));
        }
      }
    }

    if (organizations.length === 0) {
      dispatch(setSelectedOrg(null));
    } else {
      const options = organizations.map((org) => ({
        value: org.id.toString(),
        label: org.name,
      }));
      setOrgDropdownOptions(options);

      const storedOrg = getFromLocalStorage('selectedOrg');
      if (!options.find((x) => x.value === storedOrg?.value)) {
        saveToLocalStorage('selectedOrg', options[0]);
        dispatch(setSelectedOrg(options[0]));
      }
    }
  }, [organizations]);

  function useClickOutsideSome(refs: any, cb: () => void) {
    const handleClickOutside = (event: any) => {
      const isOutside = refs.every((ref: any) => {
        return ref.current && !ref.current.contains(event.target);
      });
      if (isOutside) {
        dispatch(setSideMenuOpen(false));
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

  useClickOutsideSome([ref1], () => dispatch(setSideMenuOpen(false)));

  return (
    <div className={cx(s.PageHeader, classNames)}>
      <div className={`${sideMenuOpen ? s.overlay : ''}`}></div>
      <div className={s.PageHeader__burgerColumn}></div>
      <div className={s.PageHeader__contentColumnsHolder}>
        <div className={s.PageHeader__leftColumn}>
          {(onClickBack || onClickRefresh) && (
            <div className={s.PageHeader__btns}>
              <PageHeaderButtons onClickBack={onClickBack} />
            </div>
          )}
          <div className={s.container}>
            <div className={s.labelContainer}>
              <h4 className={s.PageHeader__title}>{title}</h4>
              {/* <h5 className={s.PageHeader__subtitle}>{subtitle}</h5> */}
            </div>
            {component}
          </div>
        </div>
        <div className={s.PageHeader__rightContent}>
          <img
            className={s.burger}
            src={BurgerIcon}
            alt={'Burger'}
            onClick={() => {
              dispatch(setSideMenuOpen(true));
            }}
            ref={ref1}
          />
          <div className={s.PageHeader__accountContainer}>
            {children}
            {selectedOrg && organizations.length !== 0 && (
              <Dropdown
                position={'bottom-left'}
                icon={'org'}
                disabled={isInAdminPath}
                className={s.PageHeader__dropdown}
                options={orgDropdownOptions}
                selectedOption={selectedOrg}
                styles={{ maxWidth: 'fit-content' }}
                onChange={(o) => {
                  saveToLocalStorage('selectedOrg', o);
                  dispatch(setSelectedOrg(o));
                }}
              />
            )}
            {selectedOrgData && (
              <div className={s.PageHeader__balance}>
                <h5 className={s.totalBalanceLabel}>Your Total Balance</h5>
                <span>${convertAmount(selectedOrgData.balance)}</span>
              </div>
            )}
            <Account />
          </div>
        </div>
      </div>
    </div>
  );
};
