import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.types';

export const selectBotsState = (state: RootState) => state.bots;

export const allBotsSelector = createSelector(selectBotsState, (state) => state.botsList);

export const activeBotSelector = createSelector(selectBotsState, (state) => state.activeBot);

export const selectedBotSelector = createSelector(selectBotsState, (state) =>
  state.botsList.find((bot) => bot.id === state.activeBot),
);
export const loadingBotSelector = createSelector(selectBotsState, (state) => state.loading);
export const categoriesBotSelector = createSelector(selectBotsState, (state) => state.categories);

export const getShowEditWindowSelector = createSelector(selectBotsState, (state) => state.showEditWindow);
export const getShowDeleteWindowSelector = createSelector(selectBotsState, (state) => state.showDeleteWindow);
export const getchatBotWidgetVisible = createSelector(selectBotsState, (state) => state.chatBotWidgetVisible);
export const getchatBotWidgetHidden = createSelector(selectBotsState, (state) => state.chatBotWidgetHidden);

export const getEditTargetSelector = createSelector(selectBotsState, (state) => state.editTarget);

export const getConfig = createSelector(selectBotsState, (state) => state.config);
export const getConfigOrganizationId = createSelector(selectBotsState, (state) => state.config.bot?.organization?.id);
export const getChatIsOpenedSelectop = createSelector(selectBotsState, (state) => state.chatIsOpen);
