import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { selectUser, useAppSelector } from 'store';
import { IPrivileges } from 'types';
import styles from './NavButton.module.scss';
import { IButtonProps } from './NavButton.types.ts';

const cx = classnames.bind(styles); // <-- explicitly bind your styles

const BootstrapTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }}>
    {children}
  </Tooltip>
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#1F1F1F',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#1F1F1F',
    color: '#EEEEEE',
  },
}));

export const NavButton = (props: IButtonProps) => {
  const { urlTarget, urlCurrent, innerText, click, icon, privileges } = props;
  const user = useAppSelector(selectUser);

  const getAccess = (): boolean => {
    if (!props.entity) return true;
    const p = user && user.role && user.role.privileges && user.role.privileges.find((x) => x.entity === props.entity);
    if (p && privileges) {
      return privileges.every((x) => p[x as keyof IPrivileges]);
    }
    return false;
  };
  const [isShow, setIsShow] = useState(getAccess());

  useEffect(() => {
    setIsShow(getAccess());
  }, [user]);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  const handleShowTooltip = () => {
    if (window.innerWidth >= 900) return;
    setShowTooltip(true);
  };

  // const url = `url(${icon})`;
  if (!isShow) return <></>;
  return (
    <BootstrapTooltip
      open={showTooltip}
      onClose={handleHideTooltip}
      onOpen={handleShowTooltip}
      title={innerText}
      arrow
      placement={'right'}>
      <div
        className={cx({
          [styles.linkButton]: true,
        })}
        onClick={() => {
          if (props.disabled) return;
          click(urlTarget);
        }}>
        <div
          className={cx({
            [styles.holder]: true,
            [styles.active]: urlCurrent === urlTarget || (urlCurrent.includes(urlTarget) && !props.disabled),
            [styles.disabled]: props.disabled,
          })}>
          <img className={`${styles.iconHolder} ${props.disabled ? styles.grayedOut : ''}`} src={icon} />
          <div className={styles.textWrapper}>
            <span className={styles.textHolder}>{innerText}</span>
          </div>
        </div>
      </div>
    </BootstrapTooltip>
  );
};
