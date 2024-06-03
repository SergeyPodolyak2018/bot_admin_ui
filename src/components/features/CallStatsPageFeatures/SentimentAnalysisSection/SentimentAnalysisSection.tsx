import { PieChart } from '@mui/x-charts/PieChart';
import classNames from 'classnames/bind';
import { Loader } from 'components/common';

import { H3, Skeleton, Span } from 'components/common/Typography';
import { useTranslation } from 'react-i18next';
import { Sentiments } from 'types';
import { areAllFieldsNaN } from 'utils/sentimentsUtils';
import s from './sentimentAnalysisSection.module.scss';
import { useState } from 'react';
import { useAppDispatch } from 'store';
import { setFilters } from 'store';
import { Checkbox } from 'components/common';
const cx = classNames.bind(s);

interface ISentimentAnalysisSectionProps {
  sentiments: Sentiments;
}

export const SentimentAnalysisSection = (props: ISentimentAnalysisSectionProps) => {
  const { t } = useTranslation();
  const generalSentiment = 70;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generalSentimentPercent = Math.round((generalSentiment + 100) / 2);
  const disabledComponent = areAllFieldsNaN(props.sentiments);
  const [filterSentimentValues, setFilterSentiments] = useState(['positive', 'neutral', 'negative', '']);
  const dispatch = useAppDispatch();
  // const { positiveSentimentPercentage, neutralSentimentPercentage, negativeSentimentPercentage } = {
  //   positiveSentimentPercentage: 80,
  //   neutralSentimentPercentage: 10,
  //   negativeSentimentPercentage: 10,
  // };

  const dataExist = !disabledComponent;

  const filter = (filterValue: string) => {
    let updatedSentiments = [...filterSentimentValues];

    if (filterSentimentValues.includes(filterValue)) {
      updatedSentiments = updatedSentiments.filter((x) => x !== filterValue);
    } else {
      updatedSentiments.push(filterValue);
    }
    dispatch(setFilters(updatedSentiments));
    setFilterSentiments(updatedSentiments);
  };
  return (
    <section className={s.sentiment}>
      <H3 className={s.header}>Sentiment Analysis</H3>
      <div className={s.chartGroup}>
        <div className={s.sentiment__chart}></div>
        <div className={s.sentiment__legend}>
          {props.sentiments.positive !== 0 && (
            <div className={s.sentiment__holder}>
              <Checkbox
                checked={filterSentimentValues.includes('positive')}
                onClick={() => {
                  filter('positive');
                }}
              />
              <div
                className={cx({
                  legend__item: true,
                  positive: true,
                })}>
                <div />
                {dataExist ? (
                  <Span>
                    {t('callStatsPageFeatures.positive')} - {props.sentiments.positive}%
                  </Span>
                ) : (
                  <Skeleton width={100} height={20} />
                )}
              </div>
            </div>
          )}
          {props.sentiments.neutral !== 0 && (
            <div className={s.sentiment__holder}>
              <Checkbox
                checked={filterSentimentValues.includes('neutral')}
                onClick={() => {
                  filter('neutral');
                }}
              />
              <div
                className={cx({
                  legend__item: true,
                  neutral: true,
                })}>
                <div />
                {dataExist ? (
                  <Span>
                    {t('callStatsPageFeatures.neutral')} - {props.sentiments.neutral}%
                  </Span>
                ) : (
                  <Skeleton width={100} height={20} />
                )}
              </div>
            </div>
          )}
          {props.sentiments.negative !== 0 && (
            <div className={s.sentiment__holder}>
              <Checkbox
                checked={filterSentimentValues.includes('negative')}
                onClick={() => {
                  filter('negative');
                }}
              />
              <div
                className={cx({
                  legend__item: true,
                  negative: true,
                })}>
                <div />
                {dataExist ? (
                  <Span>
                    {t('callStatsPageFeatures.negative')} - {props.sentiments.negative}%
                  </Span>
                ) : (
                  <Skeleton width={100} height={20} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
