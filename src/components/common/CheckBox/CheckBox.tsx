import CheckBoxBase, { CheckboxProps } from '@mui/material/Checkbox';
import CheckboxUncheckedIcon from 'assets/svg/CheckboxUnchecked.svg?react';

import CheckboxCheckedIcon from 'assets/svg/Checked.svg?react';

export const Checkbox = (props: CheckboxProps) => {
  return <CheckBoxBase {...props} icon={<CheckboxUncheckedIcon />} checkedIcon={<CheckboxCheckedIcon />} />;
};
