import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialInteractionsState } from './constants';
import { fetchInteractions, fetchCountries } from './interactions.thunks';
import { TInteractionsData } from './interactions.types';
import { Interaction, Order, InteractionFields, InteractionsFilter } from 'types';
import { cloneDeep } from 'lodash';

export const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: initialInteractionsState,
  reducers: {
    setSelectedOption: (state, action: PayloadAction<TInteractionsData['selectedOption']>) => {
      state.selectedOption = action.payload;
    },
    setSearchStr: (state, action: PayloadAction<string>) => {
      state.searchStr = action.payload;
    },
    setFilter: (state, action: PayloadAction<InteractionsFilter>) => {
      state.filter = action.payload;
    },
    setFilterBufer: (state) => {
      state.filterBufer = cloneDeep(state.filter);
    },
    setSortField: (state, action: PayloadAction<InteractionFields>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<Order>) => {
      state.sortOrder = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload;
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setInteractions: (state, action: PayloadAction<Interaction[]>) => {
      state.interactions = action.payload;
    },
    setPrevFilter: (state, action: PayloadAction<string>) => {
      state.prevFilter = action.payload;
    },
    revertFilter: (state) => {
      state.filter = cloneDeep(state.filterBufer);
    },
    setShowPlaceholder: (state, action: PayloadAction<boolean>) => {
      state.showPlaceholder = action.payload;
    },
    resetInteractions: (state) => {
      if (state.interactions.length > 0) {
        state.page = 1;
        state.pages = 0;
        state.totalItems = 0;
        state.interactions = [];
        state.prevFilter = '';
        state.sortOrder = Order.DESC;
        state.sortField = 'startTimestamp';
        state.filter = {
          orgName: [],
          botName: [],
          type: ['text_chat', 'voice_chat', 'twilio_chat'],
          done: ['true', 'false'],
          sentiment: ['positive', 'neutral', 'negative', 'empty'],
          country: [],
        };
        state.filterBufer = {
          orgName: [],
          botName: [],
          type: ['text_chat', 'voice_chat', 'twilio_chat'],
          done: ['true', 'false'],
          sentiment: ['positive', 'neutral', 'negative', 'empty'],
          country: [],
        };
        state.searchStr = '';
        state.selectedOption = { label: '10', value: '10' };
        state.uploaded = false;
        state.showPlaceholder = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInteractions.pending, () => {
      //state.uploaded = false;
    });
    builder.addCase(fetchInteractions.fulfilled, (state, action) => {
      const maxPages = Math.ceil(action.payload.totalCount / action.payload.size);
      state.pages = maxPages;
      if (state.page > maxPages) {
        if (maxPages === 0) {
          state.page = 1;
        } else {
          state.page = maxPages;
        }
      }
      if (action.payload.items.length === 0) {
        state.showPlaceholder = false;
      }
      state.interactions = action.payload.items;
      state.totalItems = action.payload.totalCount;
      state.interactions = action.payload.items;
      state.uploaded = true;
    });
    builder.addCase(fetchInteractions.rejected, (state) => {
      state.interactions = [];
      state.uploaded = false;
    });

    builder.addCase(fetchCountries.pending, () => {
      //state.uploaded = false;
    });
    builder.addCase(fetchCountries.fulfilled, (state, action) => {
      state.countries = action.payload;
    });
    builder.addCase(fetchCountries.rejected, (state) => {
      state.countries = [];
    });
  },
});

export const {
  setSelectedOption,
  setSearchStr,
  setFilter,
  setSortField,
  setSortOrder,
  setPage,
  setPages,
  setTotalItems,
  setInteractions,
  setPrevFilter,
  resetInteractions,
  revertFilter,
  setFilterBufer,
} = interactionsSlice.actions;
export const interactionsReducer = interactionsSlice.reducer;
