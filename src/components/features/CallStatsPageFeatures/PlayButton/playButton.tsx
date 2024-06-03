import styles from './play.module.scss';
import PlayIcon from '../../../../assets/svg/PlayerPlayIcon.svg';
import PauseIcon from '../../../../assets/svg/PauseIconWhite.svg';
import { FC } from 'react';
interface IPlayButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}
export const PlayButton: FC<IPlayButtonProps> = ({ onClick, isPlaying }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <img src={isPlaying ? PauseIcon : PlayIcon} alt="Icon" />
    </div>
  );
};
