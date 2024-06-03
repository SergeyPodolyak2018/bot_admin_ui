import { Tooltip, tooltipClasses } from '@mui/material';
import { Fragment } from 'react';
import { TOrganisationMember } from 'types';
import styles from './allMembersAvatar.module.scss';
import Avatar from '@mui/material/Avatar';

import { stringAvatar } from 'pages/OrganisationsPage/utils.ts';

interface IAllMembers {
  users: TOrganisationMember[];
  styles: string;
}
export const AllMembersTooltipAvatar = (props: IAllMembers) => {
  return (
    <Tooltip
      title={
        <Fragment>
          <div className={styles.allMembersContainer}>
            {props.users.map((user: TOrganisationMember, index) => (
              <span key={index}>{user.email}</span>
            ))}
          </div>
        </Fragment>
      }
      placement="right"
      slotProps={{
        popper: {
          sx: {
            [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
              marginBottom: '5px',
            },
          },
        },
      }}
      arrow>
      <Avatar
        style={{
          backgroundColor: 'rgba(246, 249, 255, 1)',
          color: 'rgba(31, 31, 31, 1)',
          border: '1px solid rgba(216, 219, 223, 1)',
        }}
        children={<span style={{ height: '12px', lineHeight: '2px', fontSize: '19px' }}>...</span>}
        sx={{ width: 30, height: 30, color: 'white' }}
        className={props.styles}
      />
    </Tooltip>
  );
};
