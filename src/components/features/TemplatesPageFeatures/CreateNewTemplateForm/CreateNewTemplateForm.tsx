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
import { allBotsSelector, selectCategories, useAppSelector } from '../../../../store/index.ts';
import { CreateNewOrgFormProps } from './CreateNewTemplate.types.ts';
import styles from './createTemplateForm.module.scss';

export const CreateNewTemplateForm: FC<CreateNewOrgFormProps> = ({ onClose, onApply }) => {
  const { t } = useTranslation();
  const [bot, setBot] = useState('');
  const [type, setType] = useState(0);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const bots = useAppSelector(allBotsSelector);
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
      botId: bot,
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
          <DialogTitle>Create New Template</DialogTitle>
          <DialogContent>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {/*<p className={styles.select_label}>Select Bot</p>*/}
              <InputLabel id="demo-simple-select-label">Select Bot</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Bot"
                name="botId"
                defaultValue={''}
                onChange={(v) => {
                  setBot(v.target.value as string);
                }}>
                {bots.map((el) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.name} ({el.organization.name})
                  </MenuItem>
                ))}
              </Select>

              <InputLabel style={{ marginTop: '20px' }} id="demo-simple-select-label2">
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label2"
                id="demo-simple-select2"
                label={t('configurationPageFeatures.organizations')}
                name="typeId"
                defaultValue={0}
                onChange={(v) => {
                  setType(Number(v.target.value));
                }}>
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
                    defaultChecked={isActive}
                    onChange={(v) => setIsActive(v.target.checked)}
                  />
                }
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <TryItNowButton disabled={bot === '' || type === 0} label={'Create'} onClick={handleSubmit} />
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
