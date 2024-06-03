import { useRef } from 'react';
import { ITag } from 'utils/tagsMap';
import CloseIcon from '../../../assets/svg/closeIcon.svg';
import DragIcon from '../../../assets/svg/DragIndicator.svg';
import styles from './tag.module.scss';

interface ITagProps {
  key: number;
  tag: ITag;
  isActive?: boolean;
  handleDragStart?: (e: any) => void;
  label: string;
  onClose?: (e: any, id: string, parent: any) => void;
  dropped?: boolean;
}
export const Tag = (props: ITagProps) => {
  const tagRef = useRef<any>();
  return (
    <div
      ref={tagRef}
      key={props.key}
      data-set={props.tag.label}
      id={'option'}
      className={`${styles.option} ${props.isActive ? '' : styles.disabled} ${props.dropped ? styles.dropped : ''}`}
      draggable
      onDragStart={props.handleDragStart}
      contentEditable="false"
    >
      <img draggable={false} className={styles.icon} src={DragIcon} alt="DragIcon" />
      <span className={styles.label}>{props.label}</span>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        draggable={false}
        onClick={(e) => props.onClose && props.onClose(e, props.tag.label, tagRef.current)}
        className={styles.closeButton}
        src={CloseIcon}
        alt="СloseIcon"
      />
    </div>
  );
};
