import CloseIcon from '@mui/icons-material/Close';
import { IconButton, InputLabel } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from 'components/common';
import { FC } from 'react';
import styles from './confirmDelete.module.scss';
import { InviteMemberFormProps } from './ConfirmDelete.types.ts';

export const ConfirmDeleteBot: FC<InviteMemberFormProps> = ({ onClose, onApply, botName }) => {
  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (e: FormDataEvent) => {
    e.preventDefault();
    onApply();
  };

  return (
    <>
      <Dialog
        open={true}
        maxWidth={'sm'}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: '10px' },
          component: 'form',
          onSubmit,
        }}>
        <div className={styles.content}>
          <div className={styles.contentHolder}>
            <div className={styles.header}>
              <DialogTitle sx={{ padding: '0', fontFamily: 'inherit', fontWeight: 'inherit' }}>Delete bot</DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className={styles.body}>
              <DialogContent sx={{ padding: '0', fontFamily: 'inherit' }}>
                <InputLabel sx={{ fontFamily: 'inherit' }} id="demo-simple-select-standard-label">
                  <p className={styles.deleteLabel}>
                    Are you sure whant to delete this bot <span className={styles.boldLabel}>"{botName}"</span>?
                  </p>
                </InputLabel>
              </DialogContent>
            </div>
          </div>
          <DialogActions sx={{ justifyContent: 'center', gap: '24px', padding: '0' }}>
            <Button
              label={'Cancel'}
              onClick={handleClose}
              inverse={true}
              style={{
                width: '208px',
                height: '52px',
                fontSize: '16px',
                fontWeight: 700,
              }}
            />
            <Button
              label={'Delete'}
              type="submit"
              style={{ width: '208px', height: '52px', fontSize: '16px', fontWeight: 700 }}
            />
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
