import { Interaction, InteractionMessage } from 'types';
import { convertToTimestamp, pythonTimestampToJsTimestamp } from 'utils/primitives/date';
import { LEFT_SCALE, STEP_LEFT } from './constants.ts';

export const calculateHeight = (value: number, maxHeightPx = 50, scaleValue = 10000) => {
  const heightInOneValue = 1; // px
  const v = Math.min(heightInOneValue * (value * scaleValue), maxHeightPx);
  return v < 1 ? 0 : v;
};
export const calculateLeft = (index: number, msInOneChunk: number) => {
  return index * (msInOneChunk / LEFT_SCALE);
};

export const findItemByTime = (
  infoStartTime: Date,
  activeMessageStartTime: Date,
  msInOneChunk: number,
  maxIndexCount: number,
) => {
  const timeDifference = activeMessageStartTime.getTime() - infoStartTime.getTime();

  // Находим индекс элемента
  const itemIndex = Math.floor(timeDifference / msInOneChunk);

  if (itemIndex >= 0 && itemIndex < maxIndexCount) {
    return itemIndex; // Возвращаем индекс элемента, соответствующий времени
  }

  return -1; // Возвращаем -1, если индекс вне диапазона
};

export const mathLeftForLine = (
  info: Interaction,
  msInOneChunk: number,
  maxIndexCount: number,
  activeMessage?: InteractionMessage,
) => {
  if (!activeMessage) return null;

  const infoStartTime: Date = parseDate(info.startTimestamp);
  const infoFinishTime: Date = parseDate(info.finishTimestamp);
  const activeMessageStartTime: Date = parseDate(activeMessage.startTimestamp);
  const infoDuration: number = infoFinishTime.getTime() - infoStartTime.getTime();

  const activeMessagePosition: number = activeMessageStartTime.getTime() - infoStartTime.getTime();

  const activeMessagePercent: number = (activeMessagePosition / infoDuration) * 100;

  // const leftInPixels: number = (activeMessagePercent * STEP_LEFT(msInOneChunk) * maxIndexCount) / 100;
  return `${activeMessagePercent}%`;
};

function parseDate(dateString: string): Date {
  return new Date(dateString);
}
