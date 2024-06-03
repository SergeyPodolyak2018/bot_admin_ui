import FilterList from '@mui/icons-material/FilterList';
import { Divider, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FC } from 'react';
import { Checkbox } from '../CheckBox/index.ts';
import { MenuProps } from './DropdownFilter.constants.ts';
import s from './DropdownFilter.module.scss';
import { DropdownFilterProps } from './DropdownFilter.types.ts';
import { CustomDropDownIcon } from '../CustomDropDownIcon/CustomDropDownIcon.tsx';
import FilterIcon from '../../../assets/svg/filter.svg';
export const DropdownFilter: FC<DropdownFilterProps> = ({
  style,
  icon,
  options,
  value,
  onChange,
  placeholder,
  text,
}) => {
  const handleChange = (event: SelectChangeEvent<any>) => {
    event.preventDefault();

    const {
      target: { value },
    } = event;
    onChange(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value.filter((v: string) => v),
    );
  };
  return (
    <FormControl>
      {/*<InputLabel id="dropdown-filter-label">{placeholder}</InputLabel>*/}
      <Select
        className={s.dropdownFilter}
        sx={{
          borderRadius: '10px',
          width: '182px',
          height: '100%',
          paddingTop: '5px',
          '& fieldset': {
            borderColor: '#6F7E8C !important',
          },
          ...(style || {}),
        }}
        size={'small'}
        id="dropdown-filter"
        multiple
        IconComponent={CustomDropDownIcon}
        value={placeholder ? [undefined, ...value] : value}
        renderValue={() => {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {icon && <img src={FilterIcon} alt="Icon" />}
              <div className={s.placeholder}>{placeholder}</div>
            </div>
          );
        }}
        onChange={handleChange}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
        placeholder={'placeholder'}>
        {text && (
          <div>
            <MenuItem disabled value="">
              {text}
            </MenuItem>
            <Divider />
          </div>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) > -1} sx={{ width: '45px', height: '35px' }} />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
