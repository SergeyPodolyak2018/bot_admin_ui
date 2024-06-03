export const BaseStateStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export type BaseStateStatusT = (typeof BaseStateStatus)[keyof typeof BaseStateStatus];
