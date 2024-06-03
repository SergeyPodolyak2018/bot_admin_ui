import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import cx from 'classnames';
import { MenuItems, OverflowTip } from 'components/common';
import { CSSProperties, FC } from 'react';
import { PHONE_NUMBER_STATUS, PhoneNumber } from 'types';
import { convertToCustomFormat } from 'utils/primitives/date';
import s from './PhonesTable.module.scss';

interface IPhonesProps {
  phoneNumbers: PhoneNumber[];
  onClickSuspend: (phone: PhoneNumber) => void;
  onClickActivate: (phone: PhoneNumber) => void;
  header: {
    label: string;
    style?: CSSProperties;
  }[];
}

export const PhonesTable: FC<IPhonesProps> = ({ phoneNumbers, header, onClickSuspend, onClickActivate }) => {
  const handleClickSuspend = (phone: PhoneNumber) => {
    onClickSuspend(phone);
  };
  const handleClickActivate = (phone: PhoneNumber) => {
    onClickActivate(phone);
  };

  return (
    <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
      <TableContainer sx={{ height: '100%', maxHeight: '80vh' }}>
        <Table className={s.table} stickyHeader aria-label="sticky table" size={'small'}>
          <TableHead>
            <TableRow sx={{ boxShadow: 'none' }} className={s.headerRow}>
              {header.map((el) => (
                <TableCell className={s.headerCell} key={el.label} align="left" style={el.style}>
                  {el.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ border: 'none' }}>
            {phoneNumbers.map((phone, index) => (
              <TableRow key={index}>
                <TableCell className={s.cell} component="th" scope="row">
                  <OverflowTip value={phone.phoneNumber}>{phone.phoneNumber}</OverflowTip>
                </TableCell>
                <TableCell className={cx(s.cell)} component="th" scope="row">
                  <OverflowTip
                    classNames={cx(s.cell__status, {
                      [s.cell__status__suspended]: phone.status === PHONE_NUMBER_STATUS.SUSPENDED,
                      [s.cell__status__paid]: phone.status === PHONE_NUMBER_STATUS.PAID,
                    })}
                    value={phone.status}>
                    {phone.status === PHONE_NUMBER_STATUS.SUSPENDED ? 'Suspended' : 'Paid'}
                  </OverflowTip>
                </TableCell>
                <TableCell className={s.cell} component="th" scope="row">
                  <OverflowTip value={phone.price}> {`$${phone.price}`}</OverflowTip>
                </TableCell>
                <TableCell className={s.cell} component="th" scope="row">
                  <OverflowTip value={convertToCustomFormat(phone.paymentDate)}>
                    {convertToCustomFormat(phone.paymentDate)}
                  </OverflowTip>
                </TableCell>
                <TableCell className={s.cell} component="th" scope="row">
                  <OverflowTip value={convertToCustomFormat(phone.paymentDate)}>
                    {phone.bot ? phone.bot.name : ''}
                  </OverflowTip>
                </TableCell>
                <TableCell className={cx(s.cell)} component="th" scope="row">
                  {phone.status === PHONE_NUMBER_STATUS.PAID && (
                    <MenuItems
                      menuItems={[
                        {
                          label: phone.status === PHONE_NUMBER_STATUS.PAID ? 'Remove' : 'Activate',
                          onClick: () => {
                            if (phone.status === PHONE_NUMBER_STATUS.PAID) {
                              handleClickSuspend(phone);
                            }
                            if (phone.status === PHONE_NUMBER_STATUS.SUSPENDED) {
                              handleClickActivate(phone);
                            }
                          },
                        },
                      ]}></MenuItems>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
