import Chip from '@mui/material-next/Chip';
import { H3, P, Skeleton, Span } from 'components/common';
import { capitalize } from 'lodash';
import { FC, useMemo } from 'react';
import { Interaction } from 'types';
import { getSentiment } from 'utils/sentimentsUtils';
import s from './topicsSummary.module.scss';
import { DetailsLabel } from '../InteractionDetailsSection';

const keywordsToString = (keywords: string) => {
  const keywordString = keywords.replace(/["{}]/g, '');
  const arr = keywordString.split(',');
  if (keywords === '') {
    return undefined;
  }
  return arr.map((item: any) => {
    return (
      <Chip
        key={item}
        size="small"
        variant="outlined"
        sx={{
          height: 'fit-content',
          padding: '8px 14px 8px 14px',
          lineHeight: '24px',
          marginLeft: '8px',
          marginBottom: '8px',
          '& .MuiChip-label': {
            padding: 0,
          },
        }}
        label={<Span className={s.label}>{item}</Span>}
      />
    );
  });
};

interface TopicsSummaryProps {
  interaction: Interaction;
}

export const TopicsSummary: FC<TopicsSummaryProps> = ({ interaction }) => {
  console.log(interaction);
  const result = useMemo(() => {
    if (!interaction || !interaction.result) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(interaction.result);

      return Object.entries(parsed)
        .map(([key, value]) => {
          const capitalizedKey = capitalize(key);
          return { name: capitalizedKey, decorator: ':', value: String(value) };
        })
        .filter((entry) => entry.value !== 'null' && entry.value !== null && entry.value !== undefined);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return undefined;
    }
  }, [interaction]);

  const renderField = (label: any, value: any) => {
    if (!interaction.finishTimestamp && (!value || value.length === 0)) {
      <>
        <H3 className={s.textHeader} style={{ fontWeight: 400 }}>
          {label}
        </H3>
        <Span className={s.text}>:</Span>
        {value ? (
          typeof value === 'string' ? (
            <P className={s.text}>{value}</P>
          ) : (
            <div className={s.topics_summary__keywords}>{value}</div>
          )
        ) : (
          <Skeleton />
        )}
      </>;
    }

    if (interaction.finishTimestamp && (!value || value.length === 0)) {
      return null;
    }

    return (
      <>
        <H3 className={s.textHeader} style={{ fontWeight: 400 }}>
          {label}
        </H3>
        <Span className={s.text}>:</Span>
        {value ? (
          typeof value === 'string' ? (
            <P className={s.text}>{value}</P>
          ) : (
            <div className={`${label !== 'Result' ? s.topics_summary__keywords : s.topics_summary__result}`}>
              {value}
            </div>
          )
        ) : (
          <Skeleton />
        )}
      </>
    );
  };
  return (
    <section className={`${s.topics_summary} ${interaction.type === 'text_chat' ? s.topics_summary__singleRow : ''}`}>
      <H3 className={s.header} style={{ fontWeight: 700, lineHeight: '20px' }}>
        Topics Summary
      </H3>

      <div className={s.topics_summary__wrapper}>
        <DetailsLabel
          label={'Topic'}
          value={interaction?.topics}
          type="text"
          interactionIsFinished={interaction.finishTimestamp !== null}
        />

        <DetailsLabel
          label={'Summary'}
          value={interaction?.summary}
          type="text"
          interactionIsFinished={interaction.finishTimestamp !== null}
        />

        <DetailsLabel
          label={'Sentiment'}
          value={
            getSentiment(interaction?.sentiment) ? (
              <img
                style={{ width: '22px', height: '22px' }}
                className={s.icon}
                src={getSentiment(interaction?.sentiment)}
                alt="Icon"
              />
            ) : null
          }
          type="not_grid"
          interactionIsFinished={interaction.finishTimestamp !== null}
        />

        <DetailsLabel
          label={'Sentiment Description'}
          value={interaction?.description}
          type="text"
          interactionIsFinished={interaction.finishTimestamp !== null}
        />

        <DetailsLabel
          label={'Keywords'}
          value={keywordsToString(interaction?.keywords ? interaction?.keywords : '')}
          type="tags"
          interactionIsFinished={interaction.finishTimestamp !== null}
        />

        <DetailsLabel
          label={'Result'}
          value={result}
          type="inline"
          interactionIsFinished={interaction.finishTimestamp !== null}
        />
      </div>
    </section>
  );
};
