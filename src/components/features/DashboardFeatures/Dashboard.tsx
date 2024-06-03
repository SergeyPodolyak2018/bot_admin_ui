import { FormControl } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import RefreshIcon from '../../../assets/svg/refresh.svg?react';

import { EmptyPlaceholder, Loader } from 'components/common';
import { CustomDropDownIcon } from 'components/common/CustomDropDownIcon/CustomDropDownIcon.tsx';
import { useEffect, useState } from 'react';
import { getCountInteractions, PERIOD } from 'services';
import { selectOrg, useAppSelector } from 'store';
import styles from './Dashboard.module.scss';
import { InteractionsStatsWidget } from './InteractionsStatsWidget/InteractionsStatsWidget.tsx';
import { InteractionsTotalWidget } from './InteractionsTotalWidget/InteractionsTotalWidget.tsx';
import { TopBotsWidget } from './TopBotsWidget/TopBotsWidget.tsx';
import { LocationWidget } from './LocationWidget/LocationWidget.tsx';
import { SentimentWidget } from './SentimentWidget/SentimentWidget.tsx';
import { NegativeMentionsWidget } from './LastInteractionsWidget/NegativeMentionsWidget.tsx';

interface IPeriod {
  text: string;
  value: PERIOD;
}

export const Dashboard = () => {
  const org = useAppSelector(selectOrg);

  const periods: IPeriod[] = [
    { text: 'Last 24h', value: 'today' },
    { text: 'Last Week', value: 'week' },
    { text: 'Last Month', value: 'month' },
  ];
  const [period, setPeriod] = useState<PERIOD>(periods[0].value);
  const [count, setCount] = useState(-1);
  const [counter, setCounter] = useState(0);
  const [loader, setLoader] = useState(true);

  const fetchData = () => {
    setLoader(true);
    getCountInteractions({ organizationId: Number(org!.value), interval: period }).then((r) => {
      setCount(r.data.count);
      setCounter((p) => p + 1);
      setLoader(false);
    });
  };
  useEffect(() => {
    if (!org) return;
    fetchData();
  }, [org, period]);

  return (
    <div className={styles.mainContainer}>
      {/*{loading && <Loader type={'full-page'} />}*/}
      <div className={styles.fieldsContainer}>
        <div className={styles.fieldHolder}>
          <div className={styles.fieldName}>Overview</div>
          <div className={`${styles.field} ${styles.numbers}`}>
            <FormControl sx={{ m: 1, margin: 0, width: '100%' }} variant="outlined" size="medium">
              <Select
                size={'small'}
                IconComponent={CustomDropDownIcon}
                className={styles.customSelect}
                sx={{ borderRadius: '10px', width: '100%' }}
                name="organizationId"
                displayEmpty
                defaultValue={periods[0].value}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(v: { target: { value: string } }) => {
                  setPeriod(v.target.value as PERIOD);
                }}>
                {periods.map((el, index) => (
                  <MenuItem value={el.value} key={index}>
                    {el.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={styles.refresh} onClick={fetchData}>
          <span>Refresh</span>
          <RefreshIcon />
        </div>
      </div>
      <div className={styles.subheader}>
        {loader && <Loader type={'full-page'} />}
        {count === 0 && !loader && (
          <EmptyPlaceholder style={{ maxWidth: '100%' }} icon={'stats'} text={'No interactions for selected period.'} />
        )}
        {count > 0 && counter > 0 && org && !loader && (
          <div className={styles.widgetsContainer}>
            <div className={styles.row}>
              <InteractionsStatsWidget period={period} counter={counter} />
              <InteractionsTotalWidget period={period} counter={counter} />
            </div>
            <div className={styles.row}>
              <TopBotsWidget period={period} counter={counter} />
              <LocationWidget period={period} counter={counter} />
              <SentimentWidget period={period} counter={counter} />
            </div>
            <div className={styles.row}>
              <NegativeMentionsWidget period={period} counter={counter} />
            </div>
          </div>
        )}
      </div>
      <div className={styles.tableContainer}></div>
    </div>
  );
};
