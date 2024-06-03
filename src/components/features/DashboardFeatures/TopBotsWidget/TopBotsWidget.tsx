import styles from './TopBotsWidget.module.scss';
import { WidgetWrapper } from '../common/WidgetWrapper/WidgetWrapper.tsx';
import { Movement } from '../common/Movement/Movement.tsx';
import { getTopBots, PERIOD } from '../../../../services/index.ts';
import { selectOrg, useAppSelector } from '../../../../store/index.ts';
import { useEffect, useState } from 'react';

interface IProps {
  period: PERIOD;
  counter: number;
}

interface Data {
  uuid: string;
  botName: string;
  interactionsCount: string;
}
export const TopBotsWidget = ({ period, counter }: IProps) => {
  const org = useAppSelector(selectOrg);
  const [data, setData] = useState<Data[]>([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!org) return;
    setLoader(true);
    getTopBots({ organizationId: Number(org!.value), interval: period, limit: 3 }).then((r) => {
      setData(r.data);
      setLoader(false);
    });
  }, [counter]);

  const rightComponent = <Movement move={'down'} percentage={'1.1'} text={'vs last yesterday'} />;
  return (
    <WidgetWrapper classes={[styles.main]} title={'Agents'} rightComponent={rightComponent} loader={loader}>
      <div className={styles.content}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.tableTitle}>Bots Name</td>
              <td className={styles.tableTitle}>Interactions</td>
            </tr>

            {data.map((x) => {
              return (
                <tr key={`${x.botName}`}>
                  <td className={styles.tableText}>{x.botName}</td>
                  <td className={styles.tableText}>
                    <b>{x.interactionsCount}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WidgetWrapper>
  );
};
