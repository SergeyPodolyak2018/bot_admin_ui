import { DemoBot } from 'types';

export enum DEMO_STATUS {
  ACTIVE = 'ACTIVE',
  HIBERNATED = 'HIBERNATED',
  HIBERNATING = 'HIBERNATING',
  RESTORING = 'RESTORING',
}

export type GetDemoBotsRes = DemoBot[];
