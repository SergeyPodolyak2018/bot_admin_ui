import styles from './Movement.module.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import up from '../../../../../assets/svg/ArrowUpGreen.svg';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import down from '../../../../../assets/svg/ArrowDownRed.svg';
interface IProps {
  move: 'up' | 'down';
  percentage: string;
  text: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Movement = ({ move, percentage, text }: IProps) => {
  return (
    <div className={styles.block}>
      {/*<img src={move === 'up' ? up : down} alt={move === 'up' ? 'up' : 'down'} />*/}
      {/*<span className={move === 'up' ? styles.up : styles.down}>{percentage}%</span>*/}
      {/*<span>{text}</span>*/}
    </div>
  );
};
