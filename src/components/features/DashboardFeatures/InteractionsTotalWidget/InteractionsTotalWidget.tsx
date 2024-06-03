import styles from './InteractionsTotalWidget.module.scss';
import { WidgetWrapper } from '../common/WidgetWrapper/WidgetWrapper.tsx';
import { Movement } from '../common/Movement/Movement.tsx';
import { Linear } from '../common/Linear/Linear.tsx';
import { useEffect, useState } from 'react';
import { getTotalInteraction, PERIOD } from '../../../../services/index.ts';
import { selectOrg, useAppSelector } from '../../../../store/index.ts';
interface IData {
  countTextChat: number;
  countVoiceChat: number;
  countCellChat: number;
  total: number;
}

interface IProps {
  period: PERIOD;
  counter: number;
}

const per = (number: number, total: number) => {
  return (number / total) * 100;
};

export const InteractionsTotalWidget = ({ period, counter }: IProps) => {
  const org = useAppSelector(selectOrg);
  const [data, setData] = useState<IData>({
    countTextChat: 0,
    countVoiceChat: 0,
    countCellChat: 0,
    total: 0,
  });
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!org) return;
    setLoader(true);
    getTotalInteraction({ organizationId: Number(org!.value), interval: period }).then((r) => {
      const { countVoiceChat, countTextChat, countCellChat } = r.data;
      setData({
        countTextChat: Number(countTextChat),
        countVoiceChat: Number(countVoiceChat),
        countCellChat: Number(countCellChat),
        total: Number(countTextChat) + Number(countVoiceChat) + Number(countCellChat),
      });
      setLoader(false);
    });
  }, [counter]);
  const slider = (k: keyof IData) => {
    return (
      <div className={styles.sliderBlock}>
        <div className={styles.sliderLabel}>
          {k === 'countVoiceChat' && 'Web Call'}
          {k === 'countTextChat' && 'Text Chat'}
          {k === 'countCellChat' && 'Cell Call'}
        </div>
        <div className={styles.slider}>
          <Linear variant="determinate" value={per(data[k], data.total)} />
        </div>
        <div className={styles.sliderCount}>
          <b>{data[k]}</b>
        </div>
      </div>
    );
  };
  return (
    <WidgetWrapper classes={[styles.main]} title={'Total Interactions'} loader={loader}>
      <div className={styles.content}>
        <p className={styles.count}>
          {Number(data.countTextChat) + Number(data.countVoiceChat) + Number(data.countCellChat)}
        </p>
        <div className={styles.sliderContent}>
          {slider('countTextChat')}
          {slider('countVoiceChat')}
          {slider('countCellChat')}
        </div>
        <Movement move={'down'} percentage={'2.1'} text={'vs last yesterday'} />
      </div>
    </WidgetWrapper>
  );
};
