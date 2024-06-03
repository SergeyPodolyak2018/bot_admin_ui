import Avatar from '@mui/material/Avatar';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { stringAvatar } from 'pages/OrganisationsPage/utils.ts';

interface IUserAvatar {
  email: string;
  styles: string;
}
export const UserAvatar = (props: IUserAvatar) => {
  return (
    <Tooltip
      title={props.email}
      placement="top"
      slotProps={{
        popper: {
          sx: {
            [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
              marginBottom: '5px',
            },
          },
        },
      }}
      arrow
    >
      <Avatar {...stringAvatar(props.email)} sx={{ width: 30, height: 30 }} className={props.styles} />
    </Tooltip>
  );
};
