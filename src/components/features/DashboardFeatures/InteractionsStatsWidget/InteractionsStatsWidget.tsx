import styles from './InteractionsStatsWidget.module.scss';
import { WidgetWrapper } from '../common/WidgetWrapper/WidgetWrapper.tsx';
import { Movement } from '../common/Movement/Movement.tsx';
import { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { getInteractionByInterval, PERIOD } from '../../../../services/index.ts';
import { selectOrg, useAppSelector } from '../../../../store/index.ts';

const series = [
  {
    k: 'k',
    type: 'bar',
    xKey: 'time',
    yKey: 'value',
    showInMiniChart: true,
    tooltip: {
      renderer: function (a: { datum: any; xKey: string; yKey: number; time: string }) {
        return {
          content: `${a.datum['k']} - ${a.datum[a.yKey].toFixed(0)}`,
        };
      },
    },
  },
];
const axes = [
  {
    type: 'category',
    position: 'bottom',
    label: {
      rotation: 0,
      autoRotate: false,
      avoidCollisions: true,
    },
  },
  {
    type: 'number',
    position: 'left',
    label: {
      rotation: 0,
      autoRotate: false,
      avoidCollisions: true,
    },
  },
];

interface IProps {
  period: PERIOD;
  counter: number;
}
export const InteractionsStatsWidget = ({ period, counter }: IProps) => {
  const rightComponent = <Movement move={'up'} percentage={'2.6'} text={'vs last yesterday'} />;
  const [chartOptions, setChartOptions] = useState<any>(null);
  const org = useAppSelector(selectOrg);
  const [loader, setLoader] = useState(true);

  const getDays = async () => {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    currentDate.setDate(currentDate.getDate() + 1);

    const result = await getInteractionByInterval({
      organizationId: Number(org!.value),
      interval: 'today',
    });

    function generateDateArray() {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      let hourlyArray = Array.from({ length: 24 }, (_, index) => {
        const hour = currentHour - index; // Текущий час минус индекс элемента
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, 0, 0);
        return {
          intervalRange: date.toISOString().slice(0, 19).replace('T', ' '),
          interactionCount: '0',
        };
      });

      hourlyArray = hourlyArray.reverse();

      result.data.forEach((item) => {
        const index = hourlyArray.findIndex((x) => x.intervalRange === item.intervalRange);
        if (index != -1) {
          hourlyArray[index].interactionCount = item.interactionCount.toString();
        }
      });

      return hourlyArray;
    }

    const data = generateDateArray().map((x) => {
      const utcDate = new Date(x.intervalRange);
      const userTimezoneOffset = new Date().getTimezoneOffset() / 60;
      const userDate = new Date(utcDate.getTime() - userTimezoneOffset * 3600 * 1000);
      const userHour = userDate.getHours().toString().padStart(2, '0');
      const userMinute = userDate.getMinutes().toString().padStart(2, '0');
      const userTime = `${userHour}`;
      return {
        k: `${userTime}:${userMinute}`,
        time: userTime,
        // avgTemp: Number(x.interactionCount),
        value: Number(x.interactionCount),
      };
    });

    // setChartOptions({ data, series, axes });
    setChartOptions({ data, series });
  };

  const getWeek = async () => {
    const result = await getInteractionByInterval({
      organizationId: Number(org!.value),
      interval: 'week',
    });

    function generateDateArray() {
      const sd = new Date();
      const ld = new Date(sd);
      ld.setDate(sd.getDate() - 6);
      const fromDate = ld.toISOString().slice(0, 10);
      const toDate = sd.toISOString().slice(0, 10);

      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const dateArray = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    }

    const r = generateDateArray().map((x) => {
      const find = result.data.find((r) => r.intervalRange === x);
      return find || { intervalRange: x, interactionCount: 0 };
    });

    const data = r.map((x) => {
      const utcDate = new Date(x.intervalRange);
      const userTimezoneOffset = new Date().getTimezoneOffset() / 60;
      const userDate = new Date(utcDate.getTime() - userTimezoneOffset * 3600 * 1000);
      const userDay = userDate.getDate().toString().padStart(2, '0');
      const userMonth = (userDate.getMonth() + 1).toString().padStart(2, '0');
      const userTime = `${userDay}`;

      return {
        k: `${userMonth}.${userTime}`,
        time: userTime,
        avgTemp: Number(x.interactionCount),
        value: Number(x.interactionCount),
      };
    });

    setChartOptions({ data, series, axes });
  };

  const getMonth = async () => {
    const result = await getInteractionByInterval({
      organizationId: Number(org!.value),
      interval: 'month',
    });

    function generateDateArray() {
      const sd = new Date();
      const ld = new Date(sd);
      ld.setMonth(sd.getMonth() - 1);
      ld.setDate(sd.getDate() + 1);

      const fromDate = ld.toISOString().slice(0, 10);
      const toDate = sd.toISOString().slice(0, 10);

      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const dateArray = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    }

    const r = generateDateArray().map((x) => {
      const find = result.data.find((r) => r.intervalRange === x);
      return find || { intervalRange: x, interactionCount: 0 };
    });

    const data = r.map((x) => {
      const utcDate = new Date(x.intervalRange);
      const userTimezoneOffset = new Date().getTimezoneOffset() / 60;
      const userDate = new Date(utcDate.getTime() - userTimezoneOffset * 3600 * 1000);
      const userDay = userDate.getDate().toString().padStart(2, '0');
      const userMonth = (userDate.getMonth() + 1).toString().padStart(2, '0');
      const userTime = `${userDay}`;

      return {
        k: `${userMonth}.${userTime}`,
        time: userTime,
        avgTemp: Number(x.interactionCount),
        value: Number(x.interactionCount),
      };
    });

    setChartOptions({ data, series, axes });
  };

  useEffect(() => {
    if (!org) return;
    setLoader(true);
    if (period === 'today') {
      getDays().then(() => setLoader(false));
    } else if (period === 'week') {
      getWeek().then(() => setLoader(false));
    } else if (period === 'month') {
      getMonth().then(() => setLoader(false));
    }
  }, [counter]);
  return (
    <WidgetWrapper classes={[styles.main]} title={'Interactions'} rightComponent={rightComponent} loader={loader}>
      {chartOptions && (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
          <AgChartsReact options={chartOptions} />
        </div>
      )}
    </WidgetWrapper>
  );
};
