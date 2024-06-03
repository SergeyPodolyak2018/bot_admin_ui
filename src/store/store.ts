import { configureStore } from '@reduxjs/toolkit';
import { botsReducer } from './bots';
import { reducer as globalReducer } from './global';
import { organisationsReducer } from './organisations';
import { templatesReducer } from './templates';

import { userReducer } from './user';
import { sentimentsReducer } from './sentiments/sentiments.slice';
import { interactionsReducer } from './interactions';
import { modelsReducer } from './models';

export const store = configureStore({
  reducer: {
    user: userReducer,
    bots: botsReducer,
    global: globalReducer,
    organisations: organisationsReducer,
    templates: templatesReducer,
    sentiments: sentimentsReducer,
    interactions: interactionsReducer,
    models: modelsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
