import classNames from 'classnames/bind';
import { H3, Span } from 'components/common';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BotFull, Interaction } from 'types';
import { convertTimestampToStr } from 'utils/primitives/date';
import s from './interactionDetails.module.scss';
import { fetchBotByIdString } from 'services';
import { useState } from 'react';
import { Skeleton } from 'components/common';
import { NavigationEnum } from 'navigation';
import LinkIcon from '../../../../assets/svg/linkIcon.svg';

const cx = classNames.bind(s);

interface InteractionDetailsSectionProps {
  interaction: Interaction;
}

export const InteractionDetailsSection: FC<InteractionDetailsSectionProps> = ({ interaction }) => {
  const { t } = useTranslation();
  const [fetchedBot, setFetchedBot] = useState<BotFull>();
  const formattedStartTime = convertTimestampToStr(interaction.startTimestamp);
  useEffect(() => {
    fetchBotByIdString(interaction.botId.toString()).then((data) => setFetchedBot(data.data));
  }, []);
  return (
    <section
      className={cx({
        info: true,
      })}>
      <H3 className={s.header}>Interaction Details</H3>
      <div className={s.info__content}>
        <DetailsLabel label={'Agent'} value={fetchedBot?.name} isLink botId={interaction.botId} />
        <DetailsLabel label={'Organization'} value={fetchedBot?.organization?.name} />
        <DetailsLabel label={t('callStatsPageFeatures.startTime')} value={formattedStartTime} />
        {interaction.browserName && <DetailsLabel label={'Browser'} value={interaction.browserName} />}
        {interaction.os && <DetailsLabel label={'OS'} value={interaction.os} />}
        {interaction.ipAddress && <DetailsLabel label={'IP Address'} value={interaction.ipAddress} />}
        {interaction.country && <DetailsLabel label={'Country'} value={interaction.country} />}
        {interaction.city && <DetailsLabel label={'City'} value={interaction.city} />}
        {interaction.state && <DetailsLabel label={'State'} value={interaction.state} />}
        {interaction.zip && <DetailsLabel label={'ZIP'} value={interaction.zip} />}
        {interaction.phoneNumber && <DetailsLabel label={'Phone Number'} value={interaction.phoneNumber} />}
        {interaction.userId && <DetailsLabel label={'User ID'} value={interaction.userId} />}
      </div>
    </section>
  );
};

interface IDetailsLabel {
  label: string;
  value: string | string[] | any | undefined;
  type?: 'tags' | 'inline' | 'not_grid' | 'text';
  interactionIsFinished?: boolean;
  isLink?: boolean;
  botId?: string | number;
}
import styles from './interactionDetails.module.scss';
import { useNavigate } from 'react-router-dom';

export const DetailsLabel = (props: IDetailsLabel) => {
  const navigation = useNavigate();
  const shouldDisplaySkeleton =
    !props.interactionIsFinished &&
    (!props.value ||
      props.value === '' ||
      props.value === null ||
      props.value === 'null' ||
      (Array.isArray(props.value) && props.value.length === 0));
  if (shouldDisplaySkeleton) {
    return (
      <div className={styles.skeletonContainer}>
        <span>{props.label}: </span>
        <Skeleton sx={{ width: '100%' }} />
      </div>
    );
  }

  switch (props.type) {
    case 'tags':
      return (
        <div className={styles.tagsContainer}>
          {props.value && (
            <>
              <span className={styles.keywordsLabel}>{props.label}:</span>
              <div className={styles.tagsHolder}>
                {Array.isArray(props.value) && props.value.map((val, index) => <span key={index}>{val}</span>)}
              </div>
            </>
          )}
        </div>
      );

    case 'inline':
      return (
        <div className={styles.containerInline}>
          {props.value && props.value.length !== 0 && (
            <>
              <span>{props.label}:</span>
              <div className={styles.resultHolder}>
                {Array.isArray(props.value) &&
                  props.value.map((item, index) => {
                    if (!item || item.value === null || item.value === 'null') {
                      return null;
                    }

                    return (
                      <span key={index} className={styles.inlineLabel}>
                        <span>{item.name}</span>
                        <span>{item.decorator}</span>
                        <span>{item.value}</span>
                      </span>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      );

    case 'not_grid':
      return (
        <div className={styles.container}>
          {props.value && (
            <span className={styles.detailHeader}>
              {props.label}: {props.value}
            </span>
          )}
        </div>
      );

    case 'text':
      return (
        <div className={styles.container}>
          {props.value && (
            <span className={styles.detailHeaderText}>
              {props.label}: {props.value}
            </span>
          )}
        </div>
      );

    default:
      return props.isLink ? (
        <div className={styles.linkLabel}>
          {props.value && (
            <>
              <span className={styles.detailHeaderLink}>{props.label}</span>
              <span>:</span>
              <div className={styles.labelContainer}>
                <a href={`${NavigationEnum.AI_AGENT_CONFIG}/${props.botId}`}>{props.value}</a>
                <div className={styles.iconContainer}>
                  <img
                    onClick={() => {
                      navigation(`${NavigationEnum.AI_AGENT_CONFIG}/${props.botId}`);
                    }}
                    className={styles.icon}
                    src={LinkIcon}
                    alt={'LinkIcon'}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className={styles.label}>
          {props.value && (
            <>
              <span className={styles.detailHeader}>{props.label}</span>
              <span>:</span>
              <span>{props.value}</span>
            </>
          )}
        </div>
      );
  }
};
