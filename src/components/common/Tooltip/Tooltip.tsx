import { FC, PropsWithChildren, ReactElement } from 'react';
import { TooltipProps } from './Tooltip.types.ts';
import TooltipMui from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import cx from 'classnames';

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  text,
  children,
  withIcon,
  iconClassName,
  placement,
  arrow,
}) => {
  return (
    <TooltipMui
      title={text}
      placement={placement ? placement : 'bottom'}
      arrow={arrow}
      componentsProps={{
        tooltip: {
          sx: {
            fontSize: '14px',
            color: '#EEEEEE',
            bgcolor: '#1F1F1F',
            padding: ' 12px 16px 12px 16px',
            '& .MuiTooltip-arrow': {
              color: '#1F1F1F',
            },
          },
        },
      }}>
      {withIcon ? (
        <HelpOutlineIcon className={cx(iconClassName)} sx={{ width: '13px', height: '13px' }} />
      ) : (
        (children as ReactElement)
      )}
    </TooltipMui>
  );
};
