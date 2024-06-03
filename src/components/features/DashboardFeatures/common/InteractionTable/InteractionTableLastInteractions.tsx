import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import cx from 'classnames';
import { Columns, FixedHeaderContent, OverflowTip, SortOptions } from 'components/common';
import { InteractionsFilter } from 'pages';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Interaction, Order } from 'types';
import { convertTimestampWithMonthSrt, getTimeMMSSFormat } from 'utils/primitives/date';
import s from '../../../InteractionsPageFeatures/InteractionTable/InteractionTable.module.scss';
import { NavigationEnum } from '../../../../../navigation';
import { useNavigate } from 'react-router-dom';
interface ICallListProps {
  tableColumns: Columns;
  filter?: InteractionsFilter;
  interactions: any[];
  sortOptions: SortOptions;
  onChangeSort?: (orderBy: keyof Interaction, order: Order) => void;
  applyFilter?: () => void;
  handleScroll: () => void;
  tableRef: any;
}

export const InteractionTableLastInteractions: FC<ICallListProps> = ({
  sortOptions,
  onChangeSort,
  interactions,
  filter,
  tableColumns,
  applyFilter,
  tableRef,
  handleScroll,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getCaller = (interaction: any) => {
    if (interaction.firstName || interaction.lastName) {
      return `${interaction.firstName || ''} ${interaction.lastName || ''}`;
    }
    if (interaction.email) return interaction.email;
    if (interaction.phoneNumber) return interaction.phoneNumber;
    if (interaction.ipAddress) return interaction.ipAddress;
    return '';
  };

  const getLocation = (interaction: Interaction) => {
    const country = interaction.country === 'Unknown' ? '' : interaction.country;
    const city = interaction.city === 'Unknown' ? '' : interaction.city;
    if (!country && !city) {
      return 'Unknown';
    }
    if (country && !city) return interaction.country;
    if (city && !country) return interaction.city;
    return `${country || ''} ${city || ''}`;
  };

  const goTo = (id: string) => {
    navigate(`${NavigationEnum.INTERACTIONS}/${id}`);
  };

  return (
    <TableContainer onScroll={handleScroll} ref={tableRef}>
      <Table stickyHeader aria-label="sticky table" size={'small'} sx={{ height: '100%' }}>
        <FixedHeaderContent
          labelProps={{
            style: {
              fontSize: '16px',
            },
          }}
          applyFilter={applyFilter}
          padding={'14px 5px'}
          filter={filter}
          setFilter={() => true}
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
              className={s.row}
              onClick={() => goTo(interaction.id)}>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={interaction.botName}>{interaction.botName}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  {interaction.type === 'text_chat' && <OverflowTip value="Chat">Text Chat</OverflowTip>}
                  {interaction.type === 'voice_chat' && <OverflowTip value="Chat">Web Call</OverflowTip>}
                  {interaction.type === 'twilio_chat' && <OverflowTip value="Chat">Cell Call</OverflowTip>}
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={getCaller(interaction)}>{getCaller(interaction)}</OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={getLocation(interaction)}>{getLocation(interaction)}</OverflowTip>
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
                  <OverflowTip value={interaction.negative_count}>
                    <span style={{ color: '#FF4C77', fontWeight: 700, fontSize: '16px' }}>
                      {interaction.negative_count}
                    </span>
                  </OverflowTip>
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
                  <OverflowTip value={getTimeMMSSFormat(interaction.duration)}>
                    {' '}
                    {getTimeMMSSFormat(interaction.duration)}
                  </OverflowTip>
                </div>
              </TableCell>
              <TableCell className={s.cell} component="td" scope="row">
                <div className={s.cellWrapper}>
                  <OverflowTip value={String(interaction.countMessages)}>{interaction.countMessages}</OverflowTip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
