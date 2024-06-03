import classNames from 'classnames/bind';

import { H3, Skeleton, Span } from 'components/common/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionMessage } from 'types';
import s from './topicsSection.module.scss';

const cx = classNames.bind(s);

export const getStringFromSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  const secondsString = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${secondsString}`;
};

export const valueLabelFormat = (value: number) => {
  return getStringFromSeconds(value);
};

const mapSegmentsToTopics = (
  segments: { id: string; time: string; topic: string; keywords: string[]; start: string; end: string }[],
) => {
  const result = segments.map((segment) => {
    return {
      id: segment.id,
      time: segment.time,
      topic: segment.topic,
      keywords: segment.keywords,
      startTime: segment.start,
      end: segment.end,
    };
  });
  return result;
};

interface IKeywordsSectionProps {
  messages: InteractionMessage[];
  interactionFinished: boolean;
}

export const TopicsSection = (props: IKeywordsSectionProps) => {
  const { t } = useTranslation();
  const [keywords, setKeywords] = useState<string[]>([]);
  const mappedSegments = mapSegmentsToTopics([
    { id: '1', time: '00:02', end: '00:10', keywords: ['Order', 'pizza'], topic: 'Order pizza', start: '00:00 ' },
  ]);

  useEffect(() => {
    const hasKeywords = props.messages.some((message) => message.keywords && message.keywords.length > 0);

    if (hasKeywords) {
      const allKeywords = props.messages
        .flatMap((message) => message.keywords?.split(','))
        .map((keyword) => keyword?.trim())
        .filter((keyword) => keyword) as string[];

      const uniqueKeywords = Array.from(new Set(allKeywords));
      setKeywords(uniqueKeywords);
    } else {
      setKeywords([]);
    }
  }, [props.messages]);
  return (
    <section
      className={cx({
        topics: true,
      })}>
      <H3 className={s.header}>{t('callStatsPageFeatures.topicDetected')}</H3>
      <div className={s.topics_container}>
        {keywords?.length || props.interactionFinished ? (
          <RenderTopics onClickTopic={() => {}} mappedSegments={keywords} />
        ) : (
          <RenderTopicsSceletons />
        )}
      </div>
    </section>
  );
};
const RenderTopics = ({
  mappedSegments,
  onClickTopic,
}: {
  onClickTopic: (value: ReturnType<typeof mapSegmentsToTopics>[0], index: number) => void;
  mappedSegments: string[];
}) => {
  return (
    <div className={s.topicsHolder}>
      {mappedSegments.map((t, i) => {
        return <Span className={s.topics__item__topic}>{t}</Span>;
      })}
    </div>
  );
};

const RenderTopicsSceletons = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <div className={s.topics__item} key={index}>
            <Span className={s.topics__item__time}></Span>
            <div className={s.topics__item__topics}>
              <Skeleton width={'100%'} />
              <Skeleton width={'100%'} />
            </div>
          </div>
        );
      })}
    </>
  );
};
