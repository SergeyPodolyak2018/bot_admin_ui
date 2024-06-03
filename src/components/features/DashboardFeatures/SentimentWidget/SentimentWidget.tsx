import styles from './SentimentWidget.module.scss';
import { WidgetWrapper } from '../common/WidgetWrapper/WidgetWrapper.tsx';
import { Movement } from '../common/Movement/Movement.tsx';
import DonutChart from './DonutChart.tsx';
import { selectOrg, useAppSelector } from '../../../../store/index.ts';
import { useEffect, useState } from 'react';
import { getSentiments, PERIOD } from '../../../../services/index.ts';

interface IProps {
  period: PERIOD;
  counter: number;
}
export const SentimentWidget = ({ period, counter }: IProps) => {
  const org = useAppSelector(selectOrg);
  const [data, setData] = useState<any>();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!org) return;
    setLoader(true);
    getSentiments({ organizationId: Number(org!.value), interval: period }).then((r) => {
      const obj: any = {
        positive: 0,
        negative: 0,
        neutral: 0,
        null: 0,
      };
      let total = 0;
      r.data.forEach((x) => {
        if (x.sentiment === '') {
          obj['null'] += Number(x.count);
        } else {
          obj[x.sentiment] += Number(x.count);
        }

        total += Number(x.count);
      });

      Object.keys(obj).forEach((x) => {
        obj[x] = (obj[x] / total) * 100;
      });

      if (total === 0) {
        obj['positive'] = 0;
        obj['negative'] = 0;
        obj['neutral'] = 0;
        obj['null'] = 100;
      }

      setData(obj);
      setLoader(false);
    });
  }, [counter]);

  useEffect(() => {
    console.log('data', data);
  }, [data]);
  const rightComponent = <Movement move={'up'} percentage={'2.1'} text={'vs last yesterday'} />;

  return (
    <WidgetWrapper classes={[styles.main]} title={'Sentiment'} rightComponent={rightComponent} loader={loader}>
      <div className={styles.content}>
        {!!data && (
          //  <AgChartsReact options={chartOptions} />
          <DonutChart
            positivePercentage={data.positive}
            negativePercentage={data.negative}
            neutralPercentage={data.neutral}
            unknownPercentage={data['null']}
          />
        )}
      </div>
    </WidgetWrapper>
  );
};
