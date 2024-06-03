import { CSSProperties, useEffect, useState } from 'react';
import styles from './editButton.module.scss';

interface IButton {
  onClick?: any;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  selected?: boolean;
  //botId: number;
}
export const EditButton = (props: IButton) => {
  const [open, setOpen] = useState(false);
  const [block, setblock] = useState(false);
  const url = `url(/three-dots.svg)`;

  const togleOpen = () => {
    //e.preventDefault();
    //e.stopPropagation();
    setOpen((prev) => !prev);
    setblock(true);
    setTimeout(() => {
      setblock(false), 1000;
    });
  };

  const close = () => {
    if (block) return;
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  });

  return (
    <div className={styles.iconHolder} style={{ backgroundImage: url }} onClick={togleOpen}>
      {open && (
        <button
          style={props.style}
          type="button"
          onClick={() => {
            if (!props.disabled) {
              props.onClick();
            }
          }}
          className={`${styles.button} ${props.disabled ? styles.disabled : ''}  ${
            props.selected ? styles.selected : ''
          }`}>
          {props.label}
        </button>
      )}
    </div>
  );
};
