import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Button as TryItNowButton } from 'components/common';
import { FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectCategories, useAppSelector } from '../../../../store/index.ts';
import { EditTemplateFormProps } from './EditTemplate.types.ts';
import styles from './editTemplateForm.module.scss';

export const EditTemplateForm: FC<EditTemplateFormProps> = ({ onClose, onApply, template }) => {
  const { t } = useTranslation();
  const [type, setType] = useState(template.typeId);
  const [description, setDescription] = useState(template.description);
  const [isActive, setIsActive] = useState(template.isActive);

  const categories = useAppSelector(selectCategories);
  const handleClose = (_event: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    onApply({
      id: template.id,
      typeId: type,
      description: description,
      isActive: isActive,
    });
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
        }}
      >
        <div className={styles.content}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogContent>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <InputLabel style={{ marginTop: '20px' }} id="demo-simple-select-label2">
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label2"
                id="demo-simple-select2"
                label={t('configurationPageFeatures.organizations')}
                name="typeId"
                defaultValue={template.typeId}
                onChange={(v) => {
                  setType(Number(v.target.value));
                }}
              >
                {categories.map((el: any) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                id={'greeting'}
                name={'greeting'}
                label={'Enter Description'}
                variant="outlined"
                style={{ marginTop: '20px' }}
                multiline
                rows={3}
                defaultValue={template.description}
                onChange={(v) => {
                  setDescription(v.target.value);
                }}
              />

              <FormControlLabel
                key={'isActive'}
                label={'Active'}
                control={
                  <Checkbox
                    name={'isActive'}
                    defaultChecked={template.isActive}
                    onChange={(v) => setIsActive(v.target.checked)}
                  />
                }
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <TryItNowButton label={'Create'} onClick={handleSubmit} />
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
