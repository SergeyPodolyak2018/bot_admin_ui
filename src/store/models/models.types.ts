import { SerializedError } from '@reduxjs/toolkit';
import { IOption } from 'components/common';
import { User } from 'types/user';
import { Model } from 'types/models';

export type ModelsState = {
  models: Model[];
};
