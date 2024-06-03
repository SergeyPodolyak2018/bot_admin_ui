import Tooltip from '@mui/material/Tooltip';
import cx from 'classnames';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ClassNames } from 'types';

export interface OverflowTipProps {
  value: string;
  classNames?: ClassNames;
}

export const OverflowTip: FC<PropsWithChildren<OverflowTipProps>> = ({ value, children, classNames }) => {
  // Create Ref
  const textElementRef = useRef<any>();

  const compareSize = () => {
    const compare = textElementRef.current?.scrollWidth > textElementRef.current?.clientWidth;
    setHover(compare);
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  // remove resize listener again on "componentWillUnmount"
  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [],
  );

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false);

  return (
    <Tooltip
      title={value}
      disableHoverListener={!hoverStatus}
      style={{ fontSize: '2em' }}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            fontSize: '14px',
            color: '#EEEEEE',
            bgcolor: '#1F1F1F',
            padding: ' 12px 16px 12px 16px',
            '& .MuiTooltip-arrow': {
              color: '#1F1F1F',
            },
          },
        },
      }}>
      <div
        className={cx(classNames)}
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
        {children}
      </div>
    </Tooltip>
  );
};
