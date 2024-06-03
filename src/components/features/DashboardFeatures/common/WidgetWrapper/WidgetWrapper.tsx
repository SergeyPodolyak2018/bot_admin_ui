import styles from './WidgetWrapper.module.scss';
import { Loader } from '../../../../common';

interface IProps {
  classes: string[];
  rightComponent?: JSX.Element;
  title: string;
  loader?: boolean;
  children?: JSX.Element;
  infiniteScroll?: boolean;
}
export const WidgetWrapper = (props: IProps) => {
  return (
    <div className={[styles.wrapper, ...props.classes].join(' ')}>
      <div className={styles.header}>
        <p className={styles.title}>{props.title}</p>
        {!!props.rightComponent && <div className={styles.rightText}>{props.rightComponent}</div>}
      </div>
      {props.loader && (
        <div className={styles.loader}>
          <Loader type={'inline'} />
        </div>
      )}
      {!props.loader && props.children}
      {props.infiniteScroll && (
        <div className={styles.infiniteLoader}>
          <Loader type={'inline'} />
        </div>
      )}
    </div>
  );
};
