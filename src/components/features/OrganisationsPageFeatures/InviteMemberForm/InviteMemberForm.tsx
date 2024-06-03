import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Input, InputLabel, SelectChangeEvent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button as TryItNowButton } from 'components/common';
import { FC, useEffect, useState } from 'react';
import styles from './inviteMember.module.scss';
import { InviteMemberFormProps } from './InviteMember.types.ts';

import { styled } from '@mui/material/styles';
import { useAppDispatch } from 'store/store.hooks.ts';
import { addNotification } from 'store/index.ts';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '10px',
  },
}));

export const InviteMemberForm: FC<InviteMemberFormProps> = ({ onClose, onApply, existingUser, onChange }) => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const isEmptyOrWhitespace = (str: string) => !str.trim();

  const handleClose = (_event: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply((email || '').toLowerCase());
  };

  const handleChange = (event: SelectChangeEvent) => {
    setEmail(event.target.value);
    onChange();
  };

  useEffect(() => {
    if (!existingUser) return;
    dispatch(
      addNotification({
        message: 'This user is already a member of organization',
        title: 'Organization',
        type: 'error',
      }),
    );
  }, [existingUser]);

  return (
    <>
      <CustomDialog
        open={true}
        maxWidth={'sm'}
        onClose={handleClose}
        style={{ borderRadius: '10px', backgroundColor: 'transparent' }}
        PaperProps={{
          component: 'form',
          onSubmit,
        }}>
        <div className={styles.content}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 44,
              top: 44,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogTitle className={styles.title}>Invite New Member</DialogTitle>
          <DialogContent sx={{ padding: '0' }}>
            <div className={styles.explanation}>Please enter the email address of the member you want to invite.</div>
            <Input
              type="email"
              className={styles.inputCustom}
              // style={isEmptyOrWhitespace(email) ? { color: 'red' } : undefined}
              onChange={(e) => {
                handleChange(e as SelectChangeEvent);
              }}
              placeholder="Enter Email Address"></Input>
            {/* {existingUser && (
              <InputLabel sx={{ color: '#FF0000' }}>This user is already a member of organization</InputLabel>
            )} */}
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '441px',
              height: '52px',
              marginLeft: '44px',
              marginTop: '24px',
              padding: '0',
            }}>
            <TryItNowButton
              classNames={styles.button}
              label={'Cancel'}
              onClick={() => {
                onClose();
              }}
              inverse={true}
            />
            <TryItNowButton
              classNames={styles.button}
              disabled={isEmptyOrWhitespace(email)}
              label={'Invite'}
              onClick={() =>
                existingUser &&
                dispatch(
                  addNotification({
                    message: 'This user is already a member of organization',
                    title: 'Organization',
                    type: 'error',
                  }),
                )
              }
              type="submit"
            />
          </DialogActions>
        </div>
      </CustomDialog>
    </>
  );
};
