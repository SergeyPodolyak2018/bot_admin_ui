import InputLabel from '@mui/material/InputLabel';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
//@ts-ignore
import { MixedTags } from '../Tagify/tagify.js';
import styles from './InputWithMarkedWords.module.scss';
import { IInputWithMarkedWordsProps } from './InputWithMarkedWords.types.ts';

export const InputWithMarkedWordsDrag = (props: IInputWithMarkedWordsProps) => {
  const { text, lable, keyup, activeCategory, wrapperstyle, wrapperClassName } = props;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(text);
  }, [activeCategory]);

  const [settings] = useState<any>({
    pattern: /@/,
    dropdown: {
      enabled: 0,
      position: 'text',
    },
    editTags: 0,
    enforceWhitelist: true,

    whitelist: [
      { id: 99, value: 'Data', title: '%file%' },
      { id: 100, value: 'Current day of week', title: '%today%' },
      { id: 101, value: 'Next day of week', title: '%next_day%' },
      { id: 102, value: 'Current Time', title: '%time%' },
      { id: 103, value: 'Full Date and Time', title: '%full_date%' },
    ],
  });
  const onChange = () => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (keyup && activeCategory && activeCategory.prompt?.id) {
        keyup(activeCategory.prompt?.id);
      }
      console.log('onchange');
    }, 500);
  };

  const keysUp = (event: KeyboardEvent<HTMLImageElement>) => {
    if (event?.metaKey && event.key === 'Meta') return;
    if (event?.metaKey && event.key === 'c') return;
    if (event.ctrlKey && event.key === 'Control') return;
    if (event.ctrlKey && event.key === 'c') return;
    if (event.ctrlKey && event.key === 'v') return;
    if (event?.metaKey && event.key === 'v') return;
    console.log(event);
    if (keyup) {
      timerRef.current && clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (activeCategory && activeCategory.prompt?.id) {
          keyup(activeCategory.prompt?.id);
        }
      }, 500);
    }
  };

  return (
    <div
      onKeyDown={keysUp}
      className={wrapperClassName ? wrapperClassName : styles.editableWrapper}
      style={wrapperstyle}>
      <InputLabel className={styles.customLable}>{lable}</InputLabel>
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      {/* @ts-ignore */}
      <MixedTags
        autoFocus={false}
        settings={settings}
        className="tags"
        value={value}
        onChange={onChange}
        onClick={(e: any) => {
          console.log(e);
        }}
      />
    </div>
  );
};
