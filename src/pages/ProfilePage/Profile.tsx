import { Visibility, VisibilityOff } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { alpha, FormHelperText, IconButton, InputAdornment, OutlinedInput, Switch } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Button as TryItNowButton, Loader } from 'components/common';
import { VisuallyHiddenInput } from 'components/features/ConfigurationPageFeatures/forms';
import { useEffect, useRef, useState } from 'react';
import { updateUser } from 'services/api';
import { addNotification, fetchOrganisations, fetchUser, selectUser, useAppDispatch, useAppSelector } from 'store';
import { User } from 'types';
import logger from 'utils/logger.ts';
import styles from '../OrganisationsPage/organisation.module.scss';
import { stringAvatar } from '../OrganisationsPage/utils.ts';
import s from './Profile.module.scss';
//import ImportIcon from '../../assets/svg/import.svg';
//import { ReactComponent as ImportIcon } from '../../assets/svg/import.svg';
import SvgIcon from '@mui/material/SvgIcon';

const textFieldInputProps = {
  style: {
    borderRadius: '10px',
    color: '#1f1f1f',
  },
  sx: {
    '& .MuiInputBase-input': {
      padding: '14px',
      paddingTop: '15px',
      paddingBottom: '11px',
      minWidth: 'calc(100% - 68px)',
    },
  },
};

const GreySwitch = styled(Switch)(({ theme }) => ({
  width: 24,
  height: 11,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 14,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'rgba(31, 31, 31, 1)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 9,
    height: 9,
    borderRadius: '50%',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 11 / 2,
    opacity: 1,
    backgroundColor: 'rgba(217, 224, 236, 1)',
    boxSizing: 'border-box',
  },
}));
export const Profile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const passwordOldRef = useRef<HTMLInputElement>(null);
  const passwordNewRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<null | Blob>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [avatarSrc, setAvatarSrc] = useState<any>(null);
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [formState, setFormState] = useState<any>({});

  useEffect(() => {
    if (Object.keys(formState).length === 0 && !isDisabledButton) {
      setIsDisabledButton(true);
    } else if (Object.keys(formState).length > 0 && isDisabledButton) {
      setIsDisabledButton(false);
    }
  }, [formState]);

  useEffect(() => {
    dispatch(fetchOrganisations());
  }, []);

  const handleChange = (key: string, value: any) => {
    setFormState((prevState: any) => {
      const obj = { ...prevState, [key]: value };
      const excluded_keys = ['firstName', 'lastName', 'expertMode'];
      if ((key in user! && user![key as keyof User] === value) || (!value && !excluded_keys.includes(key))) {
        delete obj[key];
      }
      logger.debug('setFormState', obj);
      return obj;
    });
  };

  useEffect(() => {
    if (user) {
      setAvatarSrc(user.avatar ? { src: `data:${user.avatarMime};base64,${user!.avatar}` } : stringAvatar(user.email));
    }
  }, [user]);

  const handleImageChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file.size > 50 * 1024) {
      dispatch(
        addNotification({
          message: '',
          type: 'error',
          title: 'Logo must be < 50kb',
        }),
      );
      return;
    }
    setImage(file);
    handleChange('avatar', file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image) return;
    const reader = new FileReader();

    reader.readAsArrayBuffer(image as Blob);
    reader.onload = async (e) => {
      if (!e.target?.result) return;
      const blob = new Blob([e?.target?.result], {
        type: image!.type, // Тип изображения
      });
      handleChange('avatar', blob);
      handleChange('avatarMime', image!.type);
    };
  }, [image]);

  const showError = (title: string) => {
    dispatch(
      addNotification({
        message: '',
        type: 'error',
        title: title,
      }),
    );
  };

  const handleSubmit = () => {
    if (formState['newPassword'] || formState['oldPassword'] || formState['confirmPassword']) {
      if (!formState['oldPassword']) {
        return showError('Old password is empty');
      }
      if (!formState['newPassword']) {
        return showError('New password is empty');
      } else if (formState['newPassword'].length < 6) {
        return showError('New password must be more 6 chars');
      }
      if (!formState['confirmPassword']) {
        return showError('Confirm password is empty');
      }
      if (formState['newPassword'] !== formState['confirmPassword']) {
        return showError('Incorrect confirm password');
      }
    }
    const formData = new FormData();
    const arr = [];
    Object.keys(formState).forEach((key) => {
      formData.append(key, formState[key]);
      arr.push(key);
    });
    if (!arr.length) {
      return;
    }
    if (formData.entries()) {
      updateUser({ data: formData })
        .then(() => {
          dispatch(fetchUser());
          dispatch(
            addNotification({
              message: '',
              type: 'success',
              title: 'Profile updated successfully',
            }),
          );
          setFormState({});
          passwordOldRef.current!.value = '';
          passwordNewRef.current!.value = '';
          passwordConfirmRef.current!.value = '';
        })
        .catch((err) => {
          showError(err?.response?.data?.message || 'Updated user error');
        });
    }
  };

  if (!user) return <Loader type={'full-page'} />;

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={[s.subwrapper].join(' ')}>
          <div className={s.avatarContainer}>
            <div>
              {imagePreview === '' && <Avatar {...avatarSrc} sx={{ width: 50, height: 50 }} />}
              {imagePreview !== '' && <img src={imagePreview} style={{ width: 50, height: 50 }} alt="img" />}
            </div>

            <div className={s.uploadButton}>
              <Button
                className={s.uploadButtonholder}
                variant="text"
                component="label"
                role={undefined}
                tabIndex={-1}
                size={'small'}
                endIcon={
                  <SvgIcon style={{ width: '24px', height: '24px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 15.7884L7.7308 11.5193L8.78462 10.4347L11.25 12.9V4.5H12.7499V12.9L15.2153 10.4347L16.2692 11.5193L12 15.7884ZM6.3077 19.5C5.80257 19.5 5.375 19.325 5.025 18.975C4.675 18.625 4.5 18.1974 4.5 17.6923V14.9808H5.99997V17.6923C5.99997 17.7692 6.03202 17.8397 6.09612 17.9038C6.16024 17.9679 6.23077 18 6.3077 18H17.6922C17.7692 18 17.8397 17.9679 17.9038 17.9038C17.9679 17.8397 18 17.7692 18 17.6923V14.9808H19.5V17.6923C19.5 18.1974 19.325 18.625 18.975 18.975C18.625 19.325 18.1974 19.5 17.6922 19.5H6.3077Z"
                        fill="#1F1F1F"
                      />
                    </svg>
                  </SvgIcon>
                }>
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  name="file"
                  required={false}
                  accept=".JPG,.jpeg,.png,.svg"
                  onChange={handleImageChange}
                />
              </Button>
              <p>Size: 50x50; JPG or PNG; max: 50kb</p>
            </div>
          </div>
          <div className={s.form}>
            <div className={s.formElement}>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%', paddingLeft: '10px' }}>
                  <FormControlLabel
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: 'rgba(31, 31, 31, 1)',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                      },
                    }}
                    value="end"
                    style={{ marginLeft: '-10px', gap: '8px' }}
                    className={s.switcher}
                    control={
                      <GreySwitch
                        onChange={(e) => {
                          handleChange('expertMode', e.target.checked);
                        }}
                        size="small"
                        defaultChecked={user.expertMode || false}
                      />
                    }
                    label="Expert Mode"
                    labelPlacement="end"
                  />
                </FormControl>
              </div>
            </div>
            <div className={s.formElement}>
              <div className={s.subhader}>First Name</div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%' }}>
                  <TextField
                    id={'firstName'}
                    name={'firstName'}
                    variant="outlined"
                    defaultValue={user.firstName || ''}
                    placeholder={'Input your first name'}
                    multiline={false}
                    type={'text'}
                    size={'medium'}
                    autoComplete="off"
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    InputProps={textFieldInputProps}
                  />
                </FormControl>
              </div>
            </div>
            <div className={s.formElement}>
              <div className={s.subhader}>Last Name</div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%' }}>
                  <TextField
                    id={'lastName'}
                    name={'lastName'}
                    variant="outlined"
                    defaultValue={user.lastName || ''}
                    placeholder={'Input your last name'}
                    multiline={false}
                    type={'text'}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    autoComplete="off"
                    InputProps={textFieldInputProps}
                  />
                </FormControl>
              </div>
            </div>
            <div className={s.formElement} style={{ display: 'none' }}>
              <div className={s.subhader}>Email</div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%' }}>
                  <TextField
                    id={'email'}
                    name={'email'}
                    variant="outlined"
                    value={user.email || ''}
                    multiline={false}
                    type={'text'}
                    disabled={true}
                    autoComplete="username"
                    InputProps={textFieldInputProps}
                  />
                </FormControl>
              </div>
            </div>

            <div className={s.subhader} style={{ fontWeight: 'bold', marginBottom: '14px', marginTop: '40px' }}>
              Change Password
            </div>
            <div className={s.formElement}>
              <div className={s.subhader}>Old Password</div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%' }} variant="outlined">
                  <OutlinedInput
                    style={textFieldInputProps.style}
                    sx={textFieldInputProps.sx}
                    onChange={(e) => handleChange('oldPassword', e.target.value)}
                    id={'oldPassword'}
                    name={'oldPassword'}
                    multiline={false}
                    type={showPasswordOld ? 'text' : 'password'}
                    inputRef={passwordOldRef}
                    defaultValue={''}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: 'rgba(31, 31, 31, 1)', marginTop: '4px' }}
                          aria-label="toggle password visibility"
                          onClick={() => setShowPasswordOld((prev) => !prev)}
                          onMouseDown={() => setShowPasswordOld(false)}
                          edge="end">
                          {showPasswordOld ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter Old Password"
                    inputProps={{
                      autoComplete: 'off',
                      form: {
                        autoComplete: 'off',
                      },
                    }}
                  />
                </FormControl>
              </div>
            </div>
            <div className={s.formElement}>
              <div className={s.subhader}>New Password</div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%' }}>
                  <OutlinedInput
                    style={textFieldInputProps.style}
                    sx={textFieldInputProps.sx}
                    inputRef={passwordNewRef}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    id={'newPassword'}
                    name={'newPassword'}
                    multiline={false}
                    type={showPasswordNew ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: 'rgba(31, 31, 31, 1)', marginTop: '4px' }}
                          aria-label="toggle password visibility"
                          onClick={() => setShowPasswordNew((prev) => !prev)}
                          onMouseDown={() => setShowPasswordNew(false)}
                          edge="end">
                          {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter New Password"
                    inputProps={{
                      autoComplete: 'new-password',
                    }}
                    autoComplete="new-password"
                  />
                  <FormHelperText id="help-for-confirm-password-confirm" className={s.helperText}>
                    Minimum 6 characters
                  </FormHelperText>
                </FormControl>
              </div>
            </div>
            <div className={s.formElement}>
              <div className={s.subhader}>Confirm Password</div>
              <div className={styles.field}>
                <FormControl sx={{ width: '100%', height: '100%' }}>
                  <OutlinedInput
                    style={textFieldInputProps.style}
                    sx={textFieldInputProps.sx}
                    inputRef={passwordConfirmRef}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    id={'confirmPassword'}
                    name={'confirmPassword'}
                    multiline={false}
                    type={showPasswordConfirm ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: 'rgba(31, 31, 31, 1)', marginTop: '4px' }}
                          aria-label="toggle password visibility"
                          onClick={() => setShowPasswordConfirm((prev) => !prev)}
                          onMouseDown={() => setShowPasswordConfirm(false)}
                          edge="end">
                          {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter New Password"
                    autoComplete="off"
                  />
                  <FormHelperText id="help-for-confirm-password-confirm" className={s.helperText}>
                    Minimum 6 characters
                  </FormHelperText>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className={s.formElement} style={{ display: 'flex' }}>
          <TryItNowButton
            classNames={s.tryButton}
            disabled={isDisabledButton}
            label={'Change'}
            onClick={handleSubmit}
            style={{ padding: '14px 55px', alignSelf: 'flex-end' }}
          />
        </div>
      </div>
    </div>
  );
};
