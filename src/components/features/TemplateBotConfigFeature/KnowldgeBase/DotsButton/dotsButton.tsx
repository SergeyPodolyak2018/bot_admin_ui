import DotsIcon from '../../../../../assets/svg/dotsButton.svg';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import styles from './dotsButton.module.scss';
import { styled } from '@mui/material';
const StyledMenuItem = styled(MenuItem)(({ theme, disabled }) => ({
  '&:hover': {
    backgroundColor: 'white',
    cursor: 'default',
  },
  '&:focus': {
    backgroundColor: 'white',
  },
  backgroundColor: disabled ? '#D9E0EC' : 'white',
  color: disabled ? 'gray' : 'inhernal',
}));
interface IDotsButton {
  menuItems: {
    label?: string;
    icon?: string;
    onClick?: () => void;
    component?: React.ReactNode;
    render: boolean;
    disabled?: boolean;
  }[];
}
export const DotsButton = (props: IDotsButton) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <img src={DotsIcon} alt="Icon" />
      </IconButton>

      <Menu
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
            marginTop: '12px',
            maxHeight: 48 * props.menuItems.length,
            borderRadius: '10px',
            border: '1px solid #9FA6B377',
            overflow: 'hidden',
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        {props.menuItems.map(
          (item: any, index: number) =>
            item.render && (
              <StyledMenuItem
                key={index}
                onClick={() => {
                  item.onClick();
                  handleMenuClose();
                }}
                disabled={item.disabled}
                sx={{ padding: '7px', borderBottom: '1px solid #EAEEF4' }}>
                {item.component ? (
                  <div className={styles.menuItemHolder}>{item.component}</div>
                ) : (
                  <div className={styles.menuItemHolder}>
                    {item.icon && <img src={item.icon} alt={item.label} />}
                    {item.label && <span className={styles.label}>{item.label}</span>}
                  </div>
                )}
              </StyledMenuItem>
            ),
        )}
      </Menu>
    </>
  );
};
