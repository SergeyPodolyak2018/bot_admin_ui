import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { ColumnData, FixedHeaderContent } from 'components/common';
import { FC } from 'react';
import { BillingHistory as BillingHistoryType } from 'types';
import { convertTimestampToStr, pythonTimestampToJsTimestamp } from '../../../../utils/primitives/date';
import { convertAmount } from '../../../../utils/primitives/number';
import styles from './BillingHistory.module.scss';
import { styled } from '@mui/material';
import { createMuiTheme } from '@material-ui/core/styles';
import TableHead from '@mui/material/TableHead';
import { OverflowTip } from 'components/common';
import cx from 'classnames';
import { convertTimestampWithMonthSrt, getTimeMMSSFormat } from 'utils/primitives/date';

const columns: ColumnData[] = [
  {
    width: 150,
    label: 'Amount',
    dataKey: 'amount',
  },
  {
    width: 150,
    label: 'Status',
    dataKey: 'status',
  },
  {
    width: 150,
    label: 'Date',
    dataKey: 'date',
  },
  {
    width: 150,
    label: 'Payment method',
    dataKey: 'method',
  },
];

export interface BillingHistoryProps {
  history: BillingHistoryType[];
}
const StyledTableHead = styled(TableHead)((theme: any) => ({}));
const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      root: {
        padding: '4px 8px',
        backgroundColor: 'red',
      },
    },
  },
});

export const BillingHistory: FC<BillingHistoryProps> = ({ history }) => {
  return (
    <>
      <div className={styles.title}>Payment History</div>
      <div className={styles.history}>
        <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'none', marginTop: '14px' }}>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: 'none',
              minWidth: 120,
              width: '100%',
              height: '100%',
            }}>
            <Table
              sx={{ minWidth: 650, boxShadow: 'none' }}
              size="small"
              aria-label="a dense table"
              className={styles.expandTable}
              stickyHeader={true}>
              <StyledTableHead sx={{ boxShadow: 'none' }}>
                <TableRow sx={{ boxShadow: 'none' }}>
                  {columns.map((el, index) => (
                    <TableCell
                      key={el.dataKey}
                      style={{
                        width: el.width,
                        padding: 0,
                        border: 'none',
                      }}>
                      <div
                        className={cx({
                          [styles.headerCell]: true,
                          [styles.first]: index === 0,
                          [styles.last]: index === columns.length - 1,
                        })}>
                        <span className={styles.tableLabel}>{el.label}</span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {history.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        borderBottom: '1px solid #EAEEF4',
                        cursor: 'pointer',
                      }}
                      className={styles.row}>
                      <TableCell className={styles.cell} component="td" scope="row">
                        <div className={`${styles.cellWrapper} ${styles.cellWrapperRoundFirst}`}>
                          <OverflowTip value={'$' + convertAmount(row.amount)}>
                            {'$' + convertAmount(row.amount)}
                          </OverflowTip>
                        </div>
                      </TableCell>
                      <TableCell className={styles.cell} component="td" scope="row">
                        <div className={styles.cellWrapper}>
                          <span
                            className={cx({
                              [styles.cell__status]: true,
                              [styles.cell__status__started]: row.status !== 'succeeded',
                              [styles.cell__status__finished]: row.status === 'succeeded',
                            })}>
                            <OverflowTip value={row.status}>{row.status}</OverflowTip>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={styles.cell} component="td" scope="row">
                        <div className={`${styles.cellWrapper}`}>
                          <OverflowTip value={convertTimestampWithMonthSrt(pythonTimestampToJsTimestamp(row.created))}>
                            {convertTimestampWithMonthSrt(pythonTimestampToJsTimestamp(row.created))}
                          </OverflowTip>
                        </div>
                      </TableCell>
                      <TableCell className={styles.cell} component="td" scope="row">
                        <div className={`${styles.cellWrapper} ${styles.cellWrapperRoundLast}`}>
                          <OverflowTip value={row.metadata?.last4 || ''}>{row.metadata?.last4 || ''}</OverflowTip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table" size={'small'}>
              <FixedHeaderContent columns={columns} />
              <TableBody>
                {history?.map((item, index) => (
                  <TableRow key={index} sx={{ border: '1px solid #EAEEF4' }}>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        padding: '12px 24px 12px 24px',
                        border: '1px solid #EAEEF4',
                        borderRight: 'none',
                        borderRadius: '5px',
                      }}
                      component="th"
                      scope="row">
                      {convertAmount(item.amount)}$
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        padding: '12px 24px 12px 24px',
                        border: '1px solid #EAEEF4',
                        borderLeft: 'none',
                        borderRight: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                      }}
                      component="th"
                      scope="row">
                      <div style={{ backgroundColor: '#FFF6C8', width: 'fit-content', padding: '8px 18px 8px 18px' }}>
                        {item.status}
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        padding: '12px 24px 12px 24px',
                        border: '1px solid #EAEEF4',
                        borderLeft: 'none',
                        borderRight: 'none',
                      }}
                      component="th"
                      scope="row">
                      {convertTimestampToStr(pythonTimestampToJsTimestamp(item.created))}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        padding: '12px 24px 12px 24px',
                        border: '1px solid #EAEEF4',
                        borderLeft: 'none',
                        borderRadius: '5px',
                      }}
                      component="th"
                      scope="row">
                      {item.metadata?.last4 || ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
        </Paper>
      </div>
    </>
  );
};
