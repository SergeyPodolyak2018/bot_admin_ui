import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FC, PropsWithChildren, useState } from 'react';
import AddIcon from '../../../assets/svg/create_new.svg';
import PlayIcon from '../../../assets/svg/play_circle.svg';
import StopIcon from '../../../assets/svg/stop_circle.svg';
import { menuItemsSvg } from '../MenuItems/MenuSvgDictionary.tsx';
import styles from './buttonWithMenuItems.module.scss';
import { styled } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

import { MenuItemsProps } from './ButtonWithMenuItems.types.ts';

const StyledMenuItem = styled(MenuItem)(() => ({
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'default',
  },
}));
const ITEM_HEIGHT = 46;
export const ButtonWithMenuItems: FC<PropsWithChildren<MenuItemsProps>> = ({
  style,
  menuItems,
  label,
  onClick,
  isHidden,
  isRunning,
  withoutMenu,
  defaultButtonStyle,
  disabled,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (withoutMenu) return;
    if (isRunning) return;
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getIcon = () => {
    if (isHidden && isRunning) {
      return <OpenInFullIcon />;
    } else if (isRunning !== undefined) {
      if (isRunning) {
        return <img src={StopIcon} alt="stopIcon" />;
      } else {
        return <img src={PlayIcon} alt="playIcon" />;
      }
    }
    return <img src={AddIcon} alt="playIcon" />;
  };
  return (
    <>
      <button
        type={'button'}
        onClick={(e) => {
          if (disabled) return;
          handleClick(e);
          onClick && onClick();
        }}
        className={`${disabled ? styles.disabledButton : defaultButtonStyle ? styles.defaultButton : styles.button}`}
        style={{ ...style }}>
        <span className={styles.label}>{label}</span>
        {getIcon()}
      </button>
      {!withoutMenu && (
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
            sx: { padding: 0 },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          elevation={0}
          sx={{
            '& .MuiPaper-root': {
              boxShadow: '0px 0px 3px 0px #0655F340',
            },
          }}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              // width: '20ch',
              marginTop: '4px',
              width: 'max-content',
              borderRadius: '10px',
              border: '1px solid #9FA6B377',
            },
          }}>
          {menuItems.map((item, index) => (
            <StyledMenuItem
              key={item.label}
              onClick={(): void => {
                item.onClick();
                setAnchorEl(null);
              }}
              style={{ padding: '7px', borderTop: index !== 0 ? '1px solid #9FA6B377' : 'none' }}>
              <div
                className={styles.menuItem}
                onMouseEnter={(e) => e.currentTarget.classList.add(styles.hoverEffect)}
                onMouseLeave={(e) => e.currentTarget.classList.remove(styles.hoverEffect)}>
                <img className={styles.icon} src={menuItemsSvg[item.label]} alt={item.label} />
                <span className={styles.menuItemLabel}>{item.label}</span>
              </div>
            </StyledMenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};
