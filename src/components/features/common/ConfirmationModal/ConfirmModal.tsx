import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button as TryItNowButton } from 'components/common';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../index.ts';
import styles from './confirmModal.module.scss';

interface IConfirmModalProps {
  cancel: () => void;
  confirm: () => void;
  disableConfirm?: boolean;
  title?: string;
}

export const ConfirmModal: FC<PropsWithChildren<IConfirmModalProps>> = (props) => {
  const { t } = useTranslation();
  const title: any = `confirmModal.${props.title ? props.title : 'deleteOrganization'}`;
  const onSubmit = () => {
    props.confirm();
  };

  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    props.cancel();
  };

  return (
    <>
      <Dialog
        open={true}
        maxWidth={'sm'}
        onClose={handleClose}
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
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogContent>{props.children}</DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => handleClose()} label={t('confirmModal.cancel')} />
            <TryItNowButton
              disabled={props.disableConfirm}
              label={t('confirmModal.confirm')}
              onClick={() => {
                onSubmit();
                handleClose();
              }}
            />
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
