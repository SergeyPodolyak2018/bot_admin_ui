import styles from './initBanner.module.scss';
import DescIcon from '../../../../../assets/svg/DescIcon.svg';
import CalcIcon from '../../../../../assets/svg/CodeIcon.svg';
import TableIcon from '../../../../../assets/svg/TableIcon.svg';

export interface IInitBanner {
  init: (extension: 'csv' | 'txt' | 'json') => void;
}

export const InitBanner = (props: IInitBanner) => {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.buttonContainer}>
          <div
            className={styles.button}
            onClick={() => {
              props.init('csv');
            }}>
            <img src={TableIcon} alt="CalcIcon" />
            <span className={styles.label}>{'CSV'}</span>
          </div>
          <div
            className={styles.button}
            onClick={() => {
              props.init('txt');
            }}>
            <img src={DescIcon} alt="DescIcon" />
            <span className={styles.label}>{'TXT'}</span>
          </div>
          <div
            className={styles.button}
            onClick={() => {
              props.init('json');
            }}>
            <img src={CalcIcon} alt="TableIcon" />
            <span className={styles.label}>{'JSON'}</span>
          </div>
        </div>
        <span>Please import new file or create empty file.</span>
      </div>
    </div>
  );
};
