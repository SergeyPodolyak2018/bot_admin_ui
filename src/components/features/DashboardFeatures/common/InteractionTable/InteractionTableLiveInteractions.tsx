import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Columns, FixedHeaderContent, OverflowTip, SortOptions } from 'components/common';
import { InteractionsFilter } from 'pages';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Interaction, Order } from 'types';
import { getTimeMMSSFormat } from 'utils/primitives/date';
import { getSentiment } from 'utils/sentimentsUtils';
import s from '../../../InteractionsPageFeatures/InteractionTable/InteractionTable.module.scss';
interface ICallListProps {
  tableColumns: Columns;
  filter?: InteractionsFilter;
  setFilter?: (filter: InteractionsFilter) => void;
  interactions: Interaction[];
  sortOptions: SortOptions;
  onChangeSort?: (orderBy: keyof Interaction, order: Order) => void;
  applyFilter?: () => void;
}

export const InteractionTableLiveInteractions: FC<ICallListProps> = ({
  sortOptions,
  onChangeSort,
  interactions,
  filter,
  setFilter,
  tableColumns,
  applyFilter,
}) => {
  const { t } = useTranslation();

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
              className={s.row}>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={interaction.bot?.name}>{interaction.bot?.name}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={String(interaction.countMessages)}>{interaction.countMessages}</OverflowTip>
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
