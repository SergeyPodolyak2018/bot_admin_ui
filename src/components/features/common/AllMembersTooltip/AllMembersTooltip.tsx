import { Tooltip, tooltipClasses } from '@mui/material';
import { Fragment } from 'react';
import { TOrganisationMember } from 'types';
import styles from './allMembers.module.scss';

interface IAllMembers {
  users: TOrganisationMember[];
}
export const AllMembersTooltip = (props: IAllMembers) => {
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
      <span className={styles.dots}>...</span>
    </Tooltip>
  );
};
