import Search from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { FC } from 'react';
import { CssTextField } from './InputSearch.constants.ts';
import { InputSearchProps } from './InputSearch.types.ts';

export const InputSearch: FC<InputSearchProps> = ({ placeholder, id, value, onChange, style, customClass }) => {
  return (
    <CssTextField
      sx={{
        borderRadius: '10px',
      }}
      style={style}
      value={value}
      onChange={onChange}
      variant={'outlined'}
      placeholder={placeholder}
      size={'small'}
      id={id}
      hiddenLabel={true}
      autoComplete="off"
      type="search"
      className={customClass}
      InputProps={{
        sx: { paddingTop: '5px', fontSize: '1rem' },
        startAdornment: (
          <InputAdornment position="start">
            <Search style={{ color: 'rgba(31, 31, 31, 1)' }} />
          </InputAdornment>
        ),
      }}
    />
  );
};
