import cx from 'classnames';
import styles from './iconButton.module.scss';

interface IIconButtonProps {
  icon: string;
  text: string;
  disable?: boolean;
  onClick: () => void;
}

export const IconButton: React.FC<IIconButtonProps> = ({ icon, onClick, text, disable }) => {
  return (
    <div
      className={cx(styles.container, {
        [styles.disabled]: disable,
      })}
      onClick={disable ? () => {} : onClick}>
      <span className={styles.label}>{text}</span>
      <img src={icon} alt={'Icon'} />
    </div>
  );
};
