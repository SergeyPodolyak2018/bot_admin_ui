import InputAdornment from '@mui/material/InputAdornment';
import ArrowIcon from '../../../assets/svg/Expand.svg';
import CloseIcon from './closeIcon.svg?react';

export const CustomDropDownIcon = (props: any) => (
  <img
    {...props}
    src={ArrowIcon}
    alt={'ArrowIcon'}
    style={{
      transition: 'transform 0.2s ease-in-out',
      width: '24px',
      height: '24px',
      position: props.defaultDD ? 'initial' : 'relative',
      left: '-14px',
      top: '2px',
      cursor: 'pointer',
    }}
  />
);

export const CustomDropDownIconWithClose = (props: { onClickClose: () => void; defaultDD?: string }) => (
  <>
    <InputAdornment
      position="end"
      sx={{
        width: '24px',
        height: '24px',
        position: 'absolute',
        left: '120px',
        top: '15px',
        cursor: 'pointer',
        ':hover': { opacity: '0.6' },
      }}>
      <CloseIcon color="action" onClick={props.onClickClose} />
    </InputAdornment>
    <img
      onClick={(event) => event.stopPropagation()}
      {...props}
      src={ArrowIcon}
      alt={'ArrowIcon'}
      style={{
        transition: 'transform 0.2s ease-in-out',
        width: '24px',
        height: '24px',
        position: props.defaultDD ? 'initial' : 'relative',
        left: '-14px',
        top: '2px',
        cursor: 'pointer',
      }}
    />
  </>
);
