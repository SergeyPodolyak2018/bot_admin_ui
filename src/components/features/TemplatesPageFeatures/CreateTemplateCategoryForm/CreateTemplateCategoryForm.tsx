import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Button as TryItNowButton } from 'components/common';
import { FC, FormEvent, useState } from 'react';
import logger from 'utils/logger.ts';
import { VisuallyHiddenInput } from '../../ConfigurationPageFeatures/forms/index.ts';
import { inputStyle } from '../../ConfigurationPageFeatures/forms2/const.ts';
import styles from './CreateTemplateCategory.module.scss';
import { CreateTemplateCategoryProps } from './CreateTemplateCategory.types.ts';

export const CreateTemplateCategoryForm: FC<CreateTemplateCategoryProps> = ({ onClose, onApply }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const handleClose = (_event: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    const reader = new FileReader();
    if (image) {
      reader.readAsArrayBuffer(image);
      reader.onload = async (e) => {
        if (!e.target?.result) return;
        const blob = new Blob([e?.target?.result], {
          type: image.type, // Тип изображения
        });
        formData.append('image', blob);
        onApply(formData);
      };
    } else {
      const emptyArray = JSON.stringify([{}]);
      const emptyBlob = new Blob([emptyArray], {
        type: 'text/plain',
      });
      formData.append('image', emptyBlob);
      onApply(formData);
    }
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
          <DialogTitle>Create New Template Category</DialogTitle>
          <DialogContent>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <TextField
                id={'greeting'}
                name={'greeting'}
                label={'Enter Name'}
                variant="outlined"
                style={{ marginTop: '20px' }}
                multiline={false}
                onChange={(v) => {
                  setName(v.target.value);
                }}
              />

              <TextField
                id={'greeting'}
                name={'greeting'}
                label={'Enter Description'}
                variant="outlined"
                style={{ marginTop: '20px' }}
                multiline
                rows={3}
                onChange={(v) => {
                  setDescription(v.target.value);
                }}
              />

              <div
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                key="image">
                {/*{1==1 ? (*/}
                {/*    <CloseIcon*/}
                {/*        onClick={data?.resetSelectedFile}*/}
                {/*        sx={{ mt: '25px', width: '25px', height: '25px', cursor: 'pointer' }}*/}
                {/*    />*/}
                {/*) : (*/}
                {/*    <Box sx={{ width: '25px', heigth: '25px' }}></Box>*/}
                {/*)}*/}

                <TextField
                  key="fileName"
                  id="fileName"
                  disabled
                  name="image"
                  label="Image"
                  variant="standard"
                  style={{ ...inputStyle, width: '65%', color: '#000' }}
                  value={image ? image.name : ''}
                />
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#1f1f1f',
                    border: '1px solid #1f1f1f',
                    fontSize: '12px',
                    width: '40%',
                  }}
                  startIcon={<CloudUploadIcon />}>
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    name="file"
                    required={false}
                    accept=".JPG,.jpeg,.png"
                    onChange={(event) => {
                      logger.debug('file image', event.target);
                      const file = event.target?.files && event.target?.files[0];
                      if (!file) return;
                      setImage(file);
                    }}
                  />
                </Button>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <TryItNowButton disabled={name === ''} label={'Create'} onClick={handleSubmit} />
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
