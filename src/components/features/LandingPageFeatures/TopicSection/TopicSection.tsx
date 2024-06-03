import { CSSProperties } from 'react';

import styles from './topicSection.module.scss';

interface ITopicSectionProps {
  subTitle: string;
  title: string;
  style?: CSSProperties;
}

export const TopicSection = (props: ITopicSectionProps) => {
  return (
    <section className={styles.container} style={props.style}>
      <div className={styles.content}>
        <p className={styles.subTitle}>{props.subTitle}</p>
        <p className={styles.title}>{props.title}</p>
      </div>
    </section>
  );
};
