import cx from 'classnames';
import { CSSProperties, FC } from 'react';
import s from './EmptyPlaceholder.module.scss';
import BotIcon from './svg/botIcon.svg?react';
import LockIcon from './svg/lock.svg?react';
import ShieldIcon from './svg/shieldIcon.svg?react';
import StatsIcon from './svg/stats.svg?react';
import { PageHeader } from '../../features/common/MainLayout/PageHeader';
import styles from '../../features/TemplateBotConfigFeature/templateBotConfig.module.scss';
import { useNavigate } from 'react-router-dom';
interface EmptyPlaceholderProps {
  text: string;
  icon: 'bot' | 'shield' | 'lock' | 'stats';
  style?: CSSProperties;
  link?: string;
  title?: string;
}

export const EmptyPlaceholder: FC<EmptyPlaceholderProps> = ({ title, text, icon, style = {}, link }) => {
  const navigate = useNavigate();
  return (
    <div className={s.mainBlock}>
      {!!link && (
        <PageHeader
          classNames={styles.pageHeader}
          onClickBack={() => navigate(link)}
          title={title || ''}
          subtitle={''}
        />
      )}
      {/*{!!link && (*/}
      {/*  <div style={{ display: 'flex', gap: 10 }}>*/}
      {/*    <BackButton link={link} />*/}
      {/*    {!!title && <p className={s.title}>{title}</p>}*/}
      {/*  </div>*/}
      {/*)}*/}
      <div className={cx(s.EmptyPlaceholder)}>
        {icon === 'bot' && <BotIcon />}
        {icon === 'shield' && <ShieldIcon />}
        {icon === 'lock' && <LockIcon />}
        {icon === 'stats' && <StatsIcon />}
        <div style={style} className={cx(s.content)}>
          {text}
        </div>
      </div>
    </div>
  );
};
