import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Input, InputLabel, SelectChangeEvent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button as TryItNowButton } from 'components/common';
import { FC, FormEvent, useState } from 'react';
import { UpdateOrgFormProps } from './DeleteOrg.types.ts';
import styles from './DeleteOrgForm.module.scss';
import { styled } from '@mui/material/styles';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '10px',
  },
}));

export const DeleteOrgForm: FC<UpdateOrgFormProps> = ({ onClose, onApply, orgName, botCount }) => {
  const [orgNameInternal, setName] = useState('');
  const [error, setError] = useState(false);
  const isEmptyOrWhitespace = (str: string) => !str.trim();

  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: SelectChangeEvent) => {
    setName(event.target.value);
    setError(false);
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
          <DialogTitle className={styles.title}>Remove Organization</DialogTitle>
          <DialogContent sx={{ padding: '0' }}>
            <div className={styles.explanation}>
              <b>Organization &quot;{orgName}&quot;</b> includes <b>{botCount}</b> bots. To confirm organization
              deletion, input its name.
            </div>
            <Input
              className={styles.inputCustom}
              style={error ? { color: 'red' } : undefined}
              onChange={(e) => {
                handleChange(e as SelectChangeEvent);
              }}
              placeholder="Enter Organization Name "></Input>
            {/* {error && <InputLabel sx={{ color: 'red' }}>Field can not be empty</InputLabel>} */}
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
              disabled={isEmptyOrWhitespace(orgNameInternal) || error}
              label={'Confirm'}
              onClick={() => {
                if (!isEmptyOrWhitespace(orgNameInternal) && !error) {
                  if (
                    orgNameInternal.length === 0 ||
                    orgNameInternal.trim().length === 0 ||
                    orgNameInternal !== orgName
                  ) {
                    setError(true);
                    return;
                  }

                  handleClose();
                  onApply();
                }
              }}
            />
          </DialogActions>
        </div>
      </CustomDialog>
    </>
  );
};
