import styles from './LocationWidget.module.scss';
import { WidgetWrapper } from '../common/WidgetWrapper/WidgetWrapper.tsx';
import { getLocations, IResponseLocations, PERIOD } from '../../../../services/index.ts';
import { useEffect, useState } from 'react';
import { selectOrg, useAppSelector } from '../../../../store/index.ts';

interface IProps {
  period: PERIOD;
  counter: number;
}

export const LocationWidget = ({ period, counter }: IProps) => {
  const org = useAppSelector(selectOrg);
  const [data, setData] = useState<IResponseLocations[]>([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!org) return;
    setLoader(true);
    getLocations({ organizationId: Number(org!.value), interval: period, limit: 3 }).then((r) => {
      setData(r.data);
      setLoader(false);
    });
  }, [counter]);

  const getLocation = (interaction: IResponseLocations) => {
    const country = interaction.country === 'Unknown' ? '' : interaction.country;
    const city = interaction.city === 'Unknown' ? '' : interaction.city;
    if (!country && !city) {
      return 'Unknown';
    }
    if (country && !city) return interaction.country;
    if (city && !country) return interaction.city;
    return `${country || ''} ${city || ''}`;
  };

  return (
    <WidgetWrapper classes={[styles.main]} title={'Locations'} loader={loader}>
      <div className={styles.content}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.tableTitle}>Country, City</td>
              {/*<td className={styles.tableTitle}>IP Adress</td>*/}
              <td className={styles.tableTitle}>Interactions</td>
            </tr>

            {data.map((x) => {
              return (
                <tr key={`${x.country}_${x.city}`}>
                  <td className={styles.tableText}>{getLocation(x)}</td>
                  {/*<td className={styles.tableText}>----</td>*/}
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
