import classNames from 'classnames/bind';

import { Checkbox, H3, Loader, Span } from 'components/common';
import { useState } from 'react';
import { setFilters, useAppDispatch } from 'store';
import { Sentiments } from 'types';

import { areAllFieldsNaN } from 'utils/sentimentsUtils';
import s from './filterSentimentSection.module.scss';

const cx = classNames.bind(s);

interface IFilterSentimentSectionProps {
  sentiments: Sentiments;
}

export const FilterSentimentSection = (props: IFilterSentimentSectionProps) => {
  const [filterSentimentValues, setFilterSentiments] = useState(['positive', 'neutral', 'negative', '']);
  const dispatch = useAppDispatch();
  const disabledComponent = areAllFieldsNaN(props.sentiments);
  const positiveDisabled = props.sentiments.positive === 0;
  const neutralDisabled = props.sentiments.neutral === 0;
  const negativeDisabled = props.sentiments.negative === 0;
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
    <section
      className={cx({
        filter: true,
      })}>
      {disabledComponent && (
        <Loader
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          type="full-page"
        />
      )}
      <H3 className={s.header}>Filter Sentiment</H3>
      <div>
        <div
          className={cx({
            disabled: positiveDisabled || disabledComponent,
          })}
          onClick={() => {
            // dispatch(toggleSentimentValue(1));
            if (positiveDisabled || disabledComponent) return;
            filter('positive');
          }}>
          <Checkbox disabled={props.sentiments.positive === 0} checked={filterSentimentValues.includes('positive')} />
          <Span className={s.filter__item}>Positive</Span>
        </div>
        <div
          className={cx({
            disabled: neutralDisabled || disabledComponent,
          })}
          onClick={() => {
            // dispatch(toggleSentimentValue(2));
            if (neutralDisabled || disabledComponent) return;
            filter('neutral');
          }}>
          <Checkbox disabled={props.sentiments.neutral === 0} checked={filterSentimentValues.includes('neutral')} />
          <Span
            className={cx({
              filter__item: true,
              neutral: true,
            })}>
            Neutral
          </Span>
        </div>
        <div
          className={cx({
            disabled: negativeDisabled || disabledComponent,
          })}
          onClick={() => {
            if (negativeDisabled || disabledComponent) return;
            filter('negative');
            // dispatch(toggleSentimentValue(3));
          }}>
          <Checkbox disabled={props.sentiments.negative === 0} checked={filterSentimentValues.includes('negative')} />
          <Span
            className={cx({
              filter__item: true,
              negative: true,
            })}>
            Negative
          </Span>
        </div>
      </div>
    </section>
  );
};
