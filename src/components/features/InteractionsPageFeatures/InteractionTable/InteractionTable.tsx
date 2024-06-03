import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import cx from 'classnames';
import { Columns, FixedHeaderContent, OverflowTip, SortOptions } from 'components/common';
import { NavigationEnum } from 'navigation';
import { InteractionsFilter } from 'pages';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Interaction, Order } from 'types';
import { convertTimestampWithMonthSrt, getTimeMMSSFormat } from 'utils/primitives/date';
import { getSentiment } from 'utils/sentimentsUtils';
import s from './InteractionTable.module.scss';
interface ICallListProps {
  tableColumns: Columns;
  filter?: InteractionsFilter;
  setFilter?: (filter: InteractionsFilter) => void;
  interactions: Interaction[];
  sortOptions: SortOptions;
  onChangeSort?: (orderBy: keyof Interaction, order: Order) => void;
  applyFilter?: () => void;
  closeFilter?: () => void;
}

// const useStyles = makeStyles(() => ({
//   tbody: {
//     '& td .MuiTableCell-root.MuiTableCell-body': {
//       color: 'rgba(255, 255, 255, 1)',
//       backgroundColor: 'rgba(31, 31, 31, 1)',
//       borderColor: 'rgba(31, 31, 31, 1)',
//     },
//   },
// }));

export const InteractionTable: FC<ICallListProps> = ({
  sortOptions,
  onChangeSort,
  interactions,
  filter,
  setFilter,
  tableColumns,
  applyFilter,
  closeFilter,
}) => {
  const { t } = useTranslation();
  const getCaller = (interaction: Interaction) => {
    if (interaction.user) {
      if (interaction.user.firstName || interaction.user.lastName) {
        return `${interaction.user.firstName || ''} ${interaction.user.lastName || ''}`;
      }
      if (interaction.user.email) return interaction.user.email;
    }
    if (interaction.phoneNumber) return interaction.phoneNumber;
    if (interaction.ipAddress) return interaction.ipAddress;
    return '';
  };
  return (
    <TableContainer sx={{ height: '100%' }}>
      <Table stickyHeader aria-label="sticky table" size={'small'} sx={{ height: '100%' }}>
        <FixedHeaderContent
          labelProps={{
            style: {
              fontSize: '16px',
            },
          }}
          applyFilter={applyFilter}
          closeFilter={closeFilter}
          padding={'3px 5px'}
          filter={filter}
          setFilter={setFilter}
          columns={tableColumns.map((column) => ({ ...column, label: t(column.label as any) }))}
          sortOptions={sortOptions}
          onClickSort={(property, order) => {
            if (onChangeSort) {
              onChangeSort(property as keyof Interaction, order);
            }
          }}
        />
        <TableBody>
          {interactions.map((interaction, index) => (
            <TableRow
              key={index}
              sx={{
                border: '1px solid #EAEEF4',
                cursor: 'pointer',
              }}
              component={Link}
              to={`${NavigationEnum.INTERACTIONS}/${interaction.id}`}
              className={s.row}>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={`${s.cellWrapper} ${s.cellWrapperRoundFirst}`}>
                  <OverflowTip value={interaction.bot?.organization.name}>
                    {interaction.bot?.organization.name}
                  </OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={interaction.bot?.name}>{interaction.bot?.name}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={interaction.country}>{interaction.country}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={interaction.topics}>{interaction.topics}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={getCaller(interaction)}>{getCaller(interaction)}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={interaction.type}> {interaction.type}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <span
                    className={cx({
                      [s.cell__status]: true,
                      [s.cell__status__finished]: interaction.done,
                      [s.cell__status__started]: !interaction.done,
                    })}>
                    <OverflowTip value={!interaction.done ? 'Started' : 'Finished'}>
                      {!interaction.done ? 'Started' : 'Finished'}
                    </OverflowTip>
                  </span>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={String(interaction.countMessages)}>{interaction.countMessages}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={convertTimestampWithMonthSrt(interaction.startTimestamp)}>
                    {convertTimestampWithMonthSrt(interaction.startTimestamp)}
                  </OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={getTimeMMSSFormat(interaction.duration)}>
                    {' '}
                    {getTimeMMSSFormat(interaction.duration)}
                  </OverflowTip>
                </div>
              </TableCell>
              <TableCell sx={{ position: 'relative' }} className={s.cell} component="td" scope="row">
                <div className={`${s.cellWrapper} ${s.cellWrapperRoundLast}`}>
                  {interaction.sentiment && (
                    <img
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '24px',
                        height: '24px',
                        transform: 'translate(-50%, -50%)',
                      }}
                      src={getSentiment(interaction.sentiment)}
                      alt={interaction.sentiment}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
