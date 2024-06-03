import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FC, PropsWithChildren, useState } from 'react';
import { Checkbox } from '../CheckBox/CheckBox.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import styles from './MenuItems.module.scss';
import { MenuItemsProps } from './MenuItems.types.ts';
import { menuItemsSvg } from './MenuSvgDictionary.tsx';
import DotsIcon from '../../../assets/svg/DotsIcon.svg';
import { styled } from '@mui/material';
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'white',
    cursor: 'default',
  },
  '&:focus': {
    backgroundColor: 'white',
  },
}));
const ITEM_HEIGHT = 46;
export const MenuItems: FC<PropsWithChildren<MenuItemsProps>> = ({ style, menuItems, notDefaultMenu }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={styles.imgHolder} onClick={handleClick}>
        <img
          style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
          src={DotsIcon}
          alt="DotsIcon"
        />
      </div>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0px 0px 3px 0px #0655F340',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'long-button',
          sx: { padding: 0 },
        }}
        PaperProps={{
          style: {
            marginTop: '4px',
            maxHeight: notDefaultMenu ? '276px' : ITEM_HEIGHT * 4.5,
            width: notDefaultMenu ? '210px' : '171px',
            borderRadius: '10px',
            border: '1px solid #9FA6B377',
          },
        }}>
        {menuItems.map((item, index) => (
          <StyledMenuItem
            key={item.label}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              item.onClick();
              if (!item.isCheckBox) {
                setAnchorEl(null);
              }
            }}
            style={{
              padding: '7px',
              borderBottom: index !== menuItems.length - 1 && !item.isCheckBox ? '1px solid #9FA6B377' : 'none',
            }}>
            <div
              className={styles.menuItemHolder}
              style={notDefaultMenu ? { padding: '4px 7px 4px 7px' } : { padding: '7px' }}
              onMouseEnter={(e) => e.currentTarget.classList.add(styles.hoverEffect)}
              onMouseLeave={(e) => e.currentTarget.classList.remove(styles.hoverEffect)}>
              <div className={styles.menuItem}>
                {item.isCheckBox ? (
                  <Checkbox style={{ padding: 0, width: '20px', height: '20px' }} checked={item.checked} />
                ) : (
                  <img
                    style={notDefaultMenu ? { width: '24px', height: '24px' } : {}}
                    className={styles.icon}
                    src={menuItemsSvg[item.label]}
                    alt={item.label}
                  />
                )}
                <span style={notDefaultMenu ? { fontSize: '16px' } : {}} className={styles.label}>
                  {item.label}
                </span>
              </div>
              {item.isCheckBox && item.toolTipText && (
                <Tooltip
                  arrow
                  placement={'right'}
                  iconClassName={styles.tooltipIcon}
                  text={item.toolTipText}
                  withIcon
                />
              )}
            </div>
          </StyledMenuItem>
        ))}
      </Menu>
    </>
  );
};
