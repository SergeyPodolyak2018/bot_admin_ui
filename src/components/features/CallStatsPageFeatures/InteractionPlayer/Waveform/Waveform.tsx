import cx from 'classnames';
import { isMock } from 'config';
import { FC, useEffect, useState, useMemo } from 'react';
import logger from 'utils/logger.ts';
import { getTime } from 'utils/primitives/date';
import { getRandomNumber } from 'utils/primitives/number';
import { HEIGHT_SCALE, ONE_WAVE_WIDTH, STEP_LEFT, WAVE_FORM_HEIGHT } from './constants.ts';
import { calculateHeight, calculateLeft } from './utils.ts';
import s from './Waveform.module.scss';
import { useRef } from 'react';
import { mathLeftForLine } from './utils.ts';
import { Interaction } from 'types/index.ts';

export type InteractionPlayerProps = {
  isPlayingToggled: boolean;
  interaction: Interaction;
  waveform: number[];
  msInOneChunk: number;
  duration: number;
  currentTime: number;
  activeMessage: any;
  transitionEnabled: boolean;
  secondWaveform?: boolean;
  audioLineOnly?: boolean;
  time: string;
};

export const Waveform: FC<InteractionPlayerProps> = ({
  isPlayingToggled,
  interaction,
  secondWaveform,
  waveform,
  msInOneChunk = 100,
  audioLineOnly,
  duration,
  activeMessage,
  currentTime,
  transitionEnabled,
  time,
}) => {
  const [waveformData, setWaveformData] = useState(waveform);
  const countInOneSec = 1000 / msInOneChunk;
  const [currentLeft, setCurrentLeft] = useState('');
  const [useCustomLeft, setUseCustomLeft] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const addRandomEntries = () => {
    setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      const randomEntry = getRandomNumber(0, 0.0019771276340354234);
      // const countInOneSec = 1000 / msInOneChunk;
      // console.log('duration sec', waveformData.length * countInOneSec);
      setWaveformData((prevState) => [...prevState, randomEntry]);
    }, msInOneChunk);
  };

  const handleResize = () => {
    if (parentRef.current) {
      setParentWidth(parentRef.current.clientWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setParentWidth(parentRef.current.clientWidth);
    }
  }, []);

  const waveformWidth = parentWidth;
  const totalItems = waveformData?.length ?? 0;
  const itemWidth = parentWidth / totalItems;
  const itemSpacing = itemWidth * 0.1;
  const adjustedItemWidth = itemWidth - itemSpacing;

  const leftForActiveLine = useMemo(
    () => mathLeftForLine(interaction, interaction.audioMsInOneChunk || 100, waveformData?.length, activeMessage),
    [interaction, activeMessage],
  );

  useEffect(() => {
    if (leftForActiveLine !== undefined) {
      setCurrentLeft(leftForActiveLine ? leftForActiveLine : '0%');
      setUseCustomLeft(true);
    }
  }, [leftForActiveLine]);

  useEffect(() => {
    setWaveformData(waveform);

    logger.info(`Duration ${getTime((waveformData?.length / countInOneSec) * 1000)}`);
    if (isMock()) addRandomEntries();
  }, [waveform]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div
      ref={parentRef}
      className={s.waveform}
      style={{
        height: '30px',
        width: `calc(100% - 90px)`,
      }}>
      <div
        className={cx({
          [s.activeLine]: true,
          [s.activeLine__answer]: activeMessage?.type === 'answer',
        })}
        style={{
          left: useCustomLeft && !isPlayingToggled ? currentLeft : `${progressPercent}%`,
          transition: transitionEnabled ? 'left 0.5s linear' : 'none',
        }}
      />

      {audioLineOnly ? null : (
        <>
          {waveformData?.map((item, index) => {
            return (
              <div
                key={index}
                data-test={index}
                data-region={item * HEIGHT_SCALE}
                className={cx({
                  [s.waveform__item]: true,
                  [s.waveform__item__second]: secondWaveform,
                })}
                style={{
                  width: `${adjustedItemWidth}px`,
                  maxWidth: '2px',
                  left: `${index * itemWidth}px`,
                  height: `${calculateHeight(item, WAVE_FORM_HEIGHT, HEIGHT_SCALE)}px`,
                  borderRadius: '1px',
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
