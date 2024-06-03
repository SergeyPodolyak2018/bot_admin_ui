export interface ITag {
  viewLabel: string;
  label: string;
  useCategoryName?: boolean;
}

export const TagsMap: ITag[] = [
  { viewLabel: 'Data', label: '%file%' },
  { viewLabel: 'Current day of week', label: '%today%' },
  { viewLabel: 'Next day of week', label: '%next_day%' },
  { viewLabel: 'Current Time', label: '%time%' },
  { viewLabel: 'Full Date and Time', label: '%full_date%' },
];
