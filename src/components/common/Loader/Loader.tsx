import CircularProgress from '@mui/material/CircularProgress';
import cx from 'classnames';
import { CSSProperties } from 'react';
import s from './Loader.module.scss';

export type LoaderProps = {
  style?: CSSProperties;
  type: 'full-page' | 'inline';
};
export const Loader = ({ style, type }: LoaderProps) => {
  return (
    <div
      style={style}
      className={cx({
        [s.loader__fullpage]: type === 'full-page',
      })}>
      <CircularProgress color={'inherit'} />
    </div>
  );
};
