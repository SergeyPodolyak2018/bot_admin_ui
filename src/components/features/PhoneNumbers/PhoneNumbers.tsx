import { FormControl } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Loader } from 'components/common';
import { CustomDropDownIcon } from 'components/common/CustomDropDownIcon/CustomDropDownIcon.tsx';
import { useEffect, useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import {
  buyPhoneNumber,
  getAvailableCountries,
  getInvoiceHistoryByOrgId,
  getPhoneNumbers,
  removePhoneNumber,
} from 'services';
import { addNotification, selectOrg, useAppDispatch, useAppSelector } from 'store';
import { Country, PhoneNumber } from 'types';
import logger from 'utils/logger.ts';
import { Button } from '../index.ts';
import styles from './phoneNumbers.module.scss';
import { PhonesTable } from './PhonesTable/index.ts';
import { columns, countrys } from './PhonesTable/PhonesTable.constants.ts';
// import { makeStyles } from '@material-ui/core/styles';
//import ReactCountryFlag from 'react-country-flag';

// interface ITagProps {
//   key: number;
//   tag: ITag;
//   isActive?: boolean;
//   handleDragStart?: (e: any) => void;
//   label: string;
//   onClose?: (e: any, id: string, parent: any) => void;
//   dropped?: boolean;
// }

const ITEM_HEIGHT = 52;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width: 228,
      scrollbarColor: 'rgba(31, 31, 31, 1) transparent',
      // scrollbarWidth: 'thin',
      borderRadius: 5,
      marginTop: 4,
    },
  },
};

export const PhoneNumbers = () => {
  const dispatch = useAppDispatch();

  const selectedOrg = useAppSelector(selectOrg);

  const [countryList, setCountryList] = useState<Country[]>([]);
  const [phoneList, setPhoneList] = useState<PhoneNumber[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedPhone, setSelectedCPhone] = useState('');
  const [invoiceHistory, setInvoiceHistory] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountriesAction();
  }, []);

  useEffect(() => {
    if (countryList.length > 0) {
      setSelectedCPhone('');
      setSelectedCountry('US');
    }
  }, [countryList]);

  useEffect(() => {
    getInvoiceHistory();
  }, [selectedOrg]);

  useEffect(() => {
    getPhonesByCountry(selectedCountry);
  }, [selectedCountry]);

  const getInvoiceHistory = () => {
    if (!selectedOrg) return;
    setLoading(true);
    getInvoiceHistoryByOrgId(selectedOrg.value)
      .then((res) => {
        setInvoiceHistory(res.data.items);
      })
      .catch(() => {
        dispatch(addNotification({ title: 'Error with get history', type: 'error', message: '' }));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const buyPhone = async () => {
    if (selectedPhone === '') return;
    setLoading(true);
    try {
      const phone = phoneList.find((p) => p.phoneNumber === selectedPhone);
      if (!phone || !selectedOrg) return;
      await buyPhoneNumber({
        type: phone.type,
        phoneNumber: phone.phoneNumber,
        price: phone.price,
        organizationId: +selectedOrg.value,
      }).then(() => {
        getInvoiceHistory();
      });
      dispatch(addNotification({ type: 'success', title: 'Operation success', message: '' }));
      setLoading(false);
    } catch (err) {
      dispatch(addNotification({ type: 'error', title: 'Buy phone error', message: '' }));
      setLoading(false);
      console.log(err);
    }
  };

  const getCountriesAction = async () => {
    setLoading(true);
    try {
      const countries = await getAvailableCountries();
      setCountryList(countries.data);

      setLoading(false);
    } catch (err) {
      dispatch(addNotification({ type: 'error', title: "Can't get countries", message: '' }));
      console.log(err);
    }
  };

  const getPhonesByCountry = (code: string) => {
    if (!code) return;
    setLoading(true);

    getPhoneNumbers(code)
      .then((r) => {
        setPhoneList(r.data);
        setSelectedCPhone(r.data[0].phoneNumber || '');
      })
      .catch((err) => {
        dispatch(addNotification({ type: 'error', title: "Can't get phones", message: '' }));
        logger.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const changeSelect = async (code: string) => {
    setSelectedCountry(code);
  };

  const changePhone = (event: SelectChangeEvent<string>) => {
    if (!event.target.value) return;
    setSelectedCPhone(event.target.value);
  };

  const handleClickSuspend = (phone: PhoneNumber) => {
    removePhoneNumber(phone.phoneNumber)
      .then(() => {
        getInvoiceHistory();
        dispatch(addNotification({ type: 'success', title: 'Operation success', message: '' }));
      })
      .catch(() => {
        dispatch(addNotification({ type: 'error', title: 'Error', message: 'Remove phone number' }));
      });
  };

  const handleClickActivate = async (phone: PhoneNumber) => {
    const { phoneNumber, price, organizationId, type, id } = phone;
    await buyPhoneNumber({
      type,
      organizationId,
      price,
      phoneNumber,
      id,
    });
  };

  return (
    <div className={styles.mainContainer}>
      {loading && <Loader type={'full-page'} />}
      <div className={styles.header}>
        <div className={styles.fieldName}>
          <span>Buy Phone Number</span>
          {/* <Tooltip
            iconClassName={styles.tooltipIcon}
            text={`This value will be used to filter out data fragments that are not relevant enough to the original user request. This value ranges from 0 to 1, where 0 means identical and 1 - dissimilar to the user request.`}
            withIcon
          /> */}
        </div>
      </div>
      <div className={styles.fieldsContainer}>
        <div className={styles.fieldHolder} style={{ width: '150px' }}>
          <div className={styles.fieldName}>Country</div>
          <div className={styles.field} style={{ width: '100%' }}>
            <ReactFlagsSelect
              className={styles.customSelect}
              selected={selectedCountry}
              onSelect={(code: any) => changeSelect(code)}
              customLabels={countrys}
              showSelectedLabel={false}
              showSecondarySelectedLabel={true}
              countries={countryList.map((el) => el.countryCode)}
              placeholder={'Country'}
            />
          </div>
        </div>
        <div className={styles.fieldHolder}>
          <div className={styles.fieldName}>Phone number</div>
          <div className={`${styles.field} ${styles.numbers}`}>
            <FormControl sx={{ m: 1, height: '52px', margin: 0, width: '100%' }} variant="outlined" size="medium">
              <Select
                IconComponent={CustomDropDownIcon}
                className={styles.customSelect}
                sx={{ borderRadius: '10px', width: '100%' }}
                style={{ height: '52px' }}
                name="organizationId"
                displayEmpty
                value={selectedPhone}
                input={<OutlinedInput margin="dense" className="test" />}
                renderValue={
                  selectedPhone !== '' ? undefined : () => <em className={styles.placeholder}>Choose Phone Number</em>
                }
                onChange={changePhone}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={MenuProps}>
                {phoneList.map((el, index) => (
                  <MenuItem value={el.phoneNumber} key={index}>
                    {el.phoneNumber}
                    <b style={{ marginLeft: '5px' }}>{el.price}$</b>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={styles.buttonHolder}>
          <Button onClick={buyPhone} label={'Buy Now'} className={styles.button} disabled={selectedPhone === ''} />
        </div>
      </div>
      <div className={styles.subheader}>
        <div className={styles.fieldName}>Invoice History</div>
      </div>
      <div className={styles.tableContainer}>
        <PhonesTable
          onClickActivate={handleClickActivate}
          onClickSuspend={handleClickSuspend}
          phoneNumbers={invoiceHistory}
          header={columns}
        />
      </div>
    </div>
  );
};
