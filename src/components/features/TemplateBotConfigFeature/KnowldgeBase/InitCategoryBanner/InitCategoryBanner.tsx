import { FC } from 'react';
import s from './InitCategoryBanner.module.scss';
import cx from 'classnames';
import NoCategoryIcon from '../../../../../assets/svg/categoryList.svg';

export interface IInitBanner {
  init: (extension: 'csv' | 'txt' | 'json') => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const InitCategoryBanner: FC<IInitBanner> = ({ init }) => {
  return (
    <div className={s.mainBlock}>
      <div className={cx(s.EmptyPlaceholder)}>
        <img src={NoCategoryIcon} alt="Icon" />
        <div className={cx(s.content)}>{'Please add your category.'}</div>
      </div>
    </div>
  );
};
