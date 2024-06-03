import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Button as TryItNowButton } from 'components/common';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../index.ts';
import styles from './confirmModalUniversal.module.scss';

interface IConfirmModalProps {
  title: string;
  cancel: () => void;
  confirm: () => void;
  disableConfirm?: boolean;
  cancelName?: string;
  confirmName?: string;
}

export const ConfirmModalUniversal: FC<PropsWithChildren<IConfirmModalProps>> = (props) => {
  const { t } = useTranslation();
  const onSubmit = () => {
    props.confirm();
  };

  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    props.cancel();
  };

  return (
    <>
      <Dialog open={true} maxWidth={'sm'} PaperProps={{ sx: { borderRadius: '10px' } }} onClose={handleClose}>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 0,
                top: 3,
                color: (theme) => theme.palette.grey[500],
                padding: 0,
              }}>
              <CloseIcon />
            </IconButton>
            <div className={styles.title}>{props.title}</div>
            <div className={styles.subcontent}>{props.children}</div>
            <div className={styles.buttonHolder}>
              <Button
                onClick={() => handleClose()}
                style={{ height: '52px', width: '208px' }}
                label={props.cancelName || t('confirmModal.cancel')}
              />
              <TryItNowButton
                style={{ height: '52px', width: '208px' }}
                disabled={props.disableConfirm}
                label={props.confirmName || t('confirmModal.confirm')}
                onClick={() => {
                  onSubmit();
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
