import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Input, SelectChangeEvent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button as TryItNowButton } from 'components/common';
import { FC, FormEvent, useState } from 'react';
import { CreateNewOrgFormProps } from './CreateNewOrg.types.ts';
import styles from './createOrgForm.module.scss';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '10px',
  },
}));

export const CreateNewOrgForm: FC<CreateNewOrgFormProps> = ({ onClose, onApply }) => {
  const [orgName, setName] = useState('');
  const isEmptyOrWhitespace = (str: string) => !str.trim();

  const handleClose = (_event?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: SelectChangeEvent) => {
    setName(event.target.value);
  };

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
          <DialogTitle className={styles.title}>Create New Organization</DialogTitle>
          <DialogContent sx={{ padding: '0' }}>
            <div className={styles.explanation}>
              Please specify the name of your organization where your agents will be situated.
            </div>
            <Input
              className={styles.inputCustom}
              onChange={(e) => {
                handleChange(e as SelectChangeEvent);
              }}
              placeholder="Organization name"></Input>
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
                handleClose();
              }}
              inverse={true}
            />
            <TryItNowButton
              classNames={styles.button}
              disabled={isEmptyOrWhitespace(orgName)}
              label={'Create'}
              onClick={() => {
                if (!isEmptyOrWhitespace(orgName)) {
                  handleClose();
                  onApply(orgName);
                }
              }}
            />
          </DialogActions>
        </div>
      </CustomDialog>
    </>
  );
};
