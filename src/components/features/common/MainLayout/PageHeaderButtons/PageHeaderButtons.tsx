import ArrowIcon from 'assets/svg/BackArrow.svg';
import RefreshIcon from 'assets/svg/retryIcon.svg';
import { FC } from 'react';
import styles from './PageHeaderButtons.module.scss';

interface IBackButtonProps {
  onClickBack?: () => void;
  onClickRefresh?: () => void;
}
export const PageHeaderButtons: FC<IBackButtonProps> = ({ onClickBack, onClickRefresh }) => {
  return (
    <div className={styles.header}>
      {onClickBack && (
        <div
          onClick={() => {
            onClickBack();
          }}
          className={styles.button}>
          <img src={ArrowIcon} alt={'Arrow'} />
        </div>
      )}
      {onClickRefresh && (
        <div
          onClick={() => {
            onClickRefresh();
          }}
          className={styles.button}>
          <img src={RefreshIcon} alt={'Refresh'} />
        </div>
      )}
    </div>
  );
};
