import { Skeleton as SkeletonBase } from '@mui/material';
import { SkeletonOwnProps } from '@mui/material/Skeleton';
import classNames from 'classnames/bind';

import s from './Typography.module.scss';

const cx = classNames.bind(s);
const combine = (className: string | undefined, name: string) => (className ? `${className} ${name}` : name);

export const P = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
  <p
    {...props}
    className={combine(
      props.className,
      cx({
        base: true,
        p: true,
      }),
    )}>
    {props.children}
  </p>
);
export const H1 = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  <h1
    {...props}
    className={combine(
      props.className,
      cx({
        base: true,
      }),
    )}>
    {props.children}
  </h1>
);
export const H2 = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  <h2
    {...props}
    className={combine(
      props.className,
      cx({
        base: true,
        h2: true,
      }),
    )}>
    {props.children}
  </h2>
);
export const H3 = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  <h3
    {...props}
    className={combine(
      props.className,
      cx({
        base: true,
        h3: true,
      }),
    )}>
    {props.children}
  </h3>
);

export const Span = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
  <span
    {...props}
    className={combine(
      props.className,
      cx({
        base: true,
        span: true,
      }),
    )}>
    {props.children}
  </span>
);
export const Skeleton = (props: SkeletonOwnProps) => {
  return <SkeletonBase variant="text" animation="pulse" sx={{ fontSize: '12px', marginLeft: '16px' }} {...props} />;
};

export const Typo = {
  P,
  H1,
  H2,
  H3,
  Span,
};
