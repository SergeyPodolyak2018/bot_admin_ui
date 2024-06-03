import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { Box, IconButton, MenuItem, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import { visuallyHidden } from '@mui/utils';
import { Button } from 'components/common/Button';
import { Checkbox } from 'components/common/CheckBox';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Dispatch, FC, SetStateAction } from 'react';
import { Order } from 'types';
import styles from './fixedHeaderContent.module.scss';
import { SortIcon } from 'components/common/SortIcon';

export type FilterOption = {
  label: string;
  value: string;
};

export type ColumnData = {
  dataKey: string;
  label: string;
  width: number;
  sortable?: boolean;
  onClickAllChecked?: () => void;
  allChecked?: boolean;
  disable?: boolean;
  filterOptions?: FilterOption[];
};

export type Columns = ColumnData[];

export type SortOptions = {
  order: Order;
  orderBy: string;
};

export type TableFilter = {
  [dataKey: string]: string[];
};

interface FixedHeaderProps {
  filter?: TableFilter | any;
  setFilter?: Dispatch<SetStateAction<TableFilter | any>>;
  columns: Columns;
  textAlign?: any;
  padding?: string;
  onClickSort?: (property: string, order: Order) => void;
  sortOptions?: SortOptions;
  labelProps?: any;
  applyFilter?: () => void;
  closeFilter?: () => void;
}

export const FixedHeaderContent: FC<FixedHeaderProps> = ({
  labelProps,
  columns,
  textAlign,
  padding,
  sortOptions,
  onClickSort,
  filter,
  setFilter,
  applyFilter,
  closeFilter,
}) => {
  const createSortHandler = (property: any) => {
    const newOrder =
      property === sortOptions?.orderBy ? (sortOptions?.order === Order.ASC ? Order.DESC : Order.ASC) : Order.DESC;
    onClickSort && onClickSort(property, newOrder);
  };

  return (
    <TableHead sx={{ paddingBottom: '24px', borderRadius: '10px' }}>
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            className={styles.headerRow}
            size={'small'}
            key={column.dataKey}
            variant="head"
            align={'right'}
            style={{
              width: column.width,
              // minWidth: column.width,
              // maxWidth: column.width,
              textAlign: textAlign ? textAlign : 'center',
              backgroundColor: 'rgba(246, 249, 255, 1)',
              // border: 'none',
              // borderRight: index !== columns.length - 1 && filter ? '1px solid #EAEEF4' : 'none',
              padding: padding,
              color: 'rgba(31, 31, 31, 1)',
            }}
            sx={{
              backgroundColor: 'background.paper',
            }}>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
              {column.sortable && sortOptions ? (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    cursor: 'pointer',
                    gap: '9px',
                  }}
                  onClick={() => {
                    createSortHandler(column.dataKey);
                  }}>
                  <SortIcon direction={sortOptions.order} action={sortOptions.orderBy === column.dataKey} />

                  <span {...labelProps} className={styles.label}>
                    {column.label}
                  </span>
                </Box>
              ) : (
                // <TableSortLabel
                //   sx={{ width: '100%', height: '100%' }}
                //   active={sortOptions.orderBy === column.dataKey}
                //   direction={sortOptions.orderBy === column.dataKey ? sortOptions.order : 'asc'}
                //   onClick={() => {
                //     createSortHandler(column.dataKey);
                //   }}>
                //   {sortOptions.orderBy === column.dataKey ? (
                //     <Box component="span" sx={visuallyHidden}>
                //       {sortOptions.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                //     </Box>
                //   ) : null}
                //   <span {...labelProps} className={styles.label}>
                //     {column.label}
                //   </span>
                // </TableSortLabel>
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    cursor: 'pointer',
                    gap: '9px',
                  }}>
                  <SortIcon direction={''} action={false} placeholder={true} />

                  <span {...labelProps} className={styles.label}>
                    {column.label}
                  </span>
                </Box>
              )}
              {filter && setFilter && filter[column.dataKey] && column.filterOptions && (
                <PopupState variant="popover" popupId="demo-popup-menu" disableAutoFocus={true} parentPopupState={null}>
                  {(popupState) => (
                    <>
                      <IconButton aria-label="delete" {...bindTrigger(popupState)}>
                        <ArrowDropDownCircleIcon
                          sx={{
                            color: column.allChecked ? 'rgba(188, 200, 220, 1)' : 'rgba(31, 31, 31, 1)',
                            width: '21.5px',
                            height: '21.5px',
                          }}
                        />
                      </IconButton>
                      <Menu
                        {...bindMenu(popupState)}
                        onClose={() => {
                          popupState.toggle();
                          closeFilter && closeFilter();
                          // applyFilter &&

                          // applyFilter();
                        }}
                        // sx={{ height: '364px', width: '305px', minWidth: '305px', minHeight: '364px' }}
                        // style={{ height: '364px', width: '305px', minWidth: '305px', minHeight: '364px' }}
                        PaperProps={{
                          style: {
                            height: '364px',
                            width: '305px',
                            minWidth: '305px',
                            minHeight: '364px',
                            borderRadius: '10px',
                            padding: '0px',
                            overflowY: 'hidden',
                          },
                        }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            marginTop: '16px',
                            paddingLeft: '28px',
                          }}
                          className={styles.menuHeader}>
                          Filter by {column.label}
                        </Box>

                        <MenuItem onClick={column.onClickAllChecked} className={styles.menuItem}>
                          <Checkbox checked={column.allChecked} sx={{ width: '45px', height: '35px' }} />
                          Show All
                        </MenuItem>
                        <Divider className={styles.divider} />
                        <Box
                          sx={{
                            height: '168px',
                            width: '100%',
                            overflowY: 'auto',
                            scrollbarColor: 'rgb(31, 31, 31) transparent',
                            scrollbarWidth: 'thin',
                          }}>
                          {column.filterOptions?.map((option) => (
                            <MenuItem
                              key={option.value}
                              className={styles.menuItem}
                              value={option.value}
                              onClick={() => {
                                const values = filter[column.dataKey];
                                const index = values.indexOf(option.value);
                                if (index !== -1) {
                                  setFilter({
                                    ...filter,
                                    [column.dataKey]: filter[column.dataKey].filter(
                                      (_item: any, i: number) => index !== i,
                                    ),
                                  });
                                } else {
                                  setFilter({ ...filter, [column.dataKey]: [...values, option.value] });
                                }
                              }}>
                              <Checkbox
                                checked={filter[column.dataKey].indexOf(option.value) > -1}
                                sx={{ width: '45px', height: '35px' }}
                              />
                              {option.label}
                            </MenuItem>
                          ))}
                        </Box>
                        <Divider className={styles.divider} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '76px' }}>
                          <Button
                            disabled={column.disable}
                            classNames={styles.applyBtn}
                            label={'Apply'}
                            onClick={() => {
                              popupState.toggle();
                              if (!applyFilter) return;
                              applyFilter();
                            }}
                          />
                        </Box>
                      </Menu>
                    </>
                  )}
                </PopupState>

                // <DropdownFilter
                //   style={{ width: '25px', height: '25px' }}
                //   options={column.filterOptions}
                //   value={filter[column.dataKey]}
                //   onChange={(value) => setFilter((prev: any) => ({ ...prev, [column.dataKey]: value }))}
                // />
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
