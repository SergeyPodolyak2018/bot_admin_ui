import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TCategore, TFile, TPromt } from 'types';
import { TEditTarget } from '.';
import { fetchBots, fetchCategories, fetchConfig } from './bot.thunks';
import { initialBotState } from './constants';
import { cloneDeep } from 'lodash';

export const botSlice = createSlice({
  name: 'bots',
  initialState: initialBotState,
  reducers: {
    setChatIsOpened: (state, action: PayloadAction<boolean>) => {
      state.chatIsOpen = action.payload;
    },
    setActiveBot: (state, action: PayloadAction<number | string>) => {
      state.activeBot = action.payload;
    },
    setShowEditWindow: (state, action: PayloadAction<boolean>) => {
      state.showEditWindow = action.payload;
    },
    setShowConfirmDeleteWindow: (state, action: PayloadAction<boolean>) => {
      state.showDeleteWindow = action.payload;
    },
    setChatBotWidgetVisible: (state, action: PayloadAction<boolean>) => {
      state.chatBotWidgetVisible = action.payload;
    },
    setChatBotWidgetHidden: (state, action: PayloadAction<boolean>) => {
      state.chatBotWidgetHidden = action.payload;
    },

    setEditTarget: (state, action: PayloadAction<TEditTarget>) => {
      state.editTarget = action.payload;
    },
    setConfigChangesExist: (state, action: PayloadAction<boolean>) => {
      state.config.changesExist = action.payload;
    },
    resetConfig: (state) => {
      state.config = {
        bot: null,
        categories: [],
        files: [],
        prompts: [],
        phone: '',
        llmModelId: '',
      };
    },

    changeBotPromptText: (state, action: PayloadAction<string>) => {
      if (state.config.bot) {
        state.config.bot.botPrompt = action.payload;
        state.config.bot.changed = true;
        state.config.changesExist = true;
      }
    },
    changeBotPhone: (state, action: PayloadAction<string>) => {
      if (state.config.bot) {
        state.config.bot.changed = action.payload !== state.config.phone;
        state.config.changesExist = action.payload !== state.config.phone;
        state.config.phone = action.payload;
        state.config.changesExist = true;
      }
    },
    changeBotModel: (state, action: PayloadAction<string>) => {
      if (state.config.bot) {
        state.config.bot.changed = action.payload !== state.config.llmModelId;
        state.config.changesExist = action.payload !== state.config.llmModelId;
        state.config.llmModelId = action.payload;
        state.config.changesExist = true;
      }
    },
    setConfigBotField: <T>(state: any, action: PayloadAction<{ field: string; value: T }>) => {
      state.config.bot[action.payload.field as keyof typeof state.config.bot] = action.payload.value;
      state.config.bot.changed = true;
      state.config.changesExist = true;
    },
    setConfigBotOrgId: (state, action: PayloadAction<number>) => {
      if (state.config.bot) {
        state.config.bot.organization.id = action.payload;
        state.config.bot.changed = true;
        state.config.changesExist = true;
      }
    },
    setConfigBotModelId: (state, action: PayloadAction<string>) => {
      if (state.config.bot) {
        state.config.bot.llmModelId = action.payload;
        state.config.bot.changed = true;
        state.config.changesExist = true;
      }
    },
    setFile: (state, action: PayloadAction<{ id: number; value: ArrayBuffer }>) => {
      const file = state.config.files.find((el) => el.id === action.payload.id);
      if (file) {
        if (file.file) {
          file.changed = true;
          state.config.changesExist = true;
        }
        file.file = {
          data: action.payload.value,
          type: 'Bufer',
        };
      }
    },
    setImportFile: (
      state,
      action: PayloadAction<{ id: number; value: ArrayBuffer; name: string; extension: 'txt' | 'csv' | 'json' | '' }>,
    ) => {
      const file = state.config.files.find((el) => el.id === action.payload.id);
      if (file) {
        file.file = {
          data: action.payload.value,
          type: 'Bufer',
        };
        file.extension = action.payload.extension;
        file.name = action.payload.name;
        file.changed = true;
        state.config.changesExist = true;
      }
    },
    setPromptById: (state, action: PayloadAction<{ id: number; value: string }>) => {
      const prompt = state.config.prompts.find((el) => el.id === action.payload.id);
      if (prompt) {
        prompt.text = action.payload.value;
        prompt.changed = true;
        state.config.changesExist = true;
      }
    },
    addPackage: (state, action: PayloadAction<{ category: TCategore; prompt: TPromt; file: TFile }>) => {
      state.config.categories.push(action.payload.category);
      state.config.files.push(action.payload.file);
      state.config.prompts.push(action.payload.prompt);
      state.config.changesExist = true;
    },
    cloneCategory: (state, action: PayloadAction<{ categoryid: number; newId: number }>) => {
      const catCandidat = state.config.categories.find((el) => el.id === action.payload.categoryid);
      const organization = { organization: { ...state.config.bot?.organization! } };
      if (catCandidat) {
        let fileCandidat = null;
        let promptCndidat = null;
        if (catCandidat.file && catCandidat.file.id) {
          fileCandidat = state.config.files.find((el) => el.id === catCandidat.file?.id);
        }
        if (catCandidat.prompt && catCandidat.prompt.id) {
          promptCndidat = state.config.prompts.find((el) => el.id === catCandidat.prompt?.id);
        }
        const duplCat = cloneDeep(catCandidat);
        const duplFile = fileCandidat ? { ...cloneDeep(fileCandidat), ...organization } : null;
        const duplPrompt = promptCndidat ? { ...cloneDeep(promptCndidat), ...organization } : null;
        console.log(duplCat);
        duplCat.id = action.payload.newId;
        duplCat.name = duplCat.name + '-copy';
        duplCat.containeNonExist = true;
        duplCat.changed = true;

        if (duplCat.file) duplCat.file.id = action.payload.newId;
        if (duplCat.prompt) duplCat.prompt.id = action.payload.newId;

        if (duplFile) {
          duplFile.id = action.payload.newId;
          duplFile.changed = true;
          state.config.files.push(duplFile);
        }
        if (duplPrompt) {
          duplPrompt.id = action.payload.newId;
          duplPrompt.changed = true;
          state.config.prompts.push(duplPrompt);
        }
        const index = state.config.categories.findIndex((el) => el.id === action.payload.categoryid);
        state.config.categories.splice(index + 1, 0, duplCat);
        //state.config.categories.push(duplCat);
        state.config.changesExist = true;
      }
    },
    addCategory: (state, action: PayloadAction<TCategore>) => {
      state.config.categories.push(action.payload);
      const category = state.config.categories.find((el) => el.id === action.payload.id);
      if (category) category.changed = true;

      state.config.changesExist = true;
    },
    markAsDeletedCategory: (state, action: PayloadAction<{ id: number }>) => {
      const category = state.config.categories.find((el) => el.id === action.payload.id);
      if (category) {
        const file = state.config.files.find((el) => el.id === category.file?.id);
        const prompt = state.config.prompts.find((el) => el.id === category.prompt?.id);
        category.deleted = true;
        category.changed = true;
        if (file) {
          file.deleted = true;
          file.changed = true;
        }
        if (prompt) {
          prompt.deleted = true;
          prompt.changed = true;
        }
        state.config.changesExist = true;
      }
    },
    markAsDeletedIndependentCategory: (state, action: PayloadAction<{ id: number }>) => {
      const category = state.config.categories.find((el) => el.id === action.payload.id);
      if (category) {
        category.deleted = true;
        category.changed = true;
        state.config.changesExist = true;
      }
    },
    markAsDeletedIndependentFile: (state, action: PayloadAction<{ id: number }>) => {
      const file = state.config.files.find((el) => el.id === action.payload.id);
      const fileindex = state.config.files.findIndex((el) => el.id === action.payload.id);
      const categoryLinked = state.config.categories.find((el) => el.file?.id === action.payload.id);

      if (categoryLinked) {
        categoryLinked.file = null;
      }
      if (file) {
        if (file.id > 0) {
          file.deleted = true;
          file.changed = true;
          state.config.changesExist = true;
        } else {
          state.config.files.splice(fileindex, 1);
        }
      }
    },
    markAsDeletedIndependentPrompt: (state, action: PayloadAction<{ id: number }>) => {
      const prompt = state.config.prompts.find((el) => el.id === action.payload.id);
      const promptindex = state.config.files.findIndex((el) => el.id === action.payload.id);
      const categoryLinked = state.config.categories.find((el) => el.prompt?.id === action.payload.id);

      if (categoryLinked) {
        categoryLinked.prompt = null;
      }
      if (prompt) {
        if (prompt.id > 0) {
          prompt.deleted = true;
          prompt.changed = true;
          state.config.changesExist = true;
        } else {
          state.config.prompts.splice(promptindex, 1);
        }
      }
    },

    changeCategoryName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const category = state.config.categories.find((el) => el.id === action.payload.id);
      if (category) {
        category.name = action.payload.name;
        state.config.changesExist = true;
        category.changed = true;
      }
    },
    addFile: (state, action: PayloadAction<TFile>) => {
      state.config.files.push(action.payload);
      state.config.changesExist = true;
    },
    cleanFileById: (state, action: PayloadAction<{ id: number }>) => {
      const file = state.config.files.find((el) => el.id === action.payload.id);
      if (file) {
        file.changed = true;
        file.name = '';
        file.extension = '';
        file.file.data = [] as never as ArrayBuffer;
        state.config.changesExist = true;
      }
    },

    addNewFile: (state, action: PayloadAction<{ categotyid: number; file: TFile }>) => {
      const category = state.config.categories.find((el) => el.id === action.payload.categotyid);
      if (category) {
        state.config.files.push(action.payload.file);
        category.file = action.payload.file;
        state.config.changesExist = true;
        category.changed = true;
        category.containeNonExist = true;
      }
    },

    addNewIndependentFile: (state, action: PayloadAction<{ file: TFile }>) => {
      state.config.files.push(action.payload.file);
      state.config.changesExist = true;
    },

    showExistingIndependentFile: (state, action: PayloadAction<{ fileId: number; design: string }>) => {
      const file = state.config.files.find((el) => el.id === action.payload.fileId);
      if (!file) return;
      file.tempShowInSchema = true;
      file.tempDisign = action.payload.design;
    },
    addNewIndependentPrompt: (state, action: PayloadAction<{ prompt: TPromt }>) => {
      state.config.prompts.push(action.payload.prompt);
      state.config.changesExist = true;
    },

    showExistingIndependentPrompt: (state, action: PayloadAction<{ promptId: number; design: string }>) => {
      const prompt = state.config.prompts.find((el) => el.id === action.payload.promptId);
      if (!prompt) return;
      prompt.tempShowInSchema = true;
      prompt.tempDisign = action.payload.design;
    },
    connectCategoryToFile: (state, action: PayloadAction<{ categoryId: number; fileId: number }>) => {
      const file = state.config.files.find((el) => el.id === action.payload.fileId);
      const category = state.config.categories.find((el) => el.id === action.payload.categoryId);
      if (!file || !category) return;
      category.file = cloneDeep(file);
      category.changed = true;
      if (file.id < 0) {
        category.containeNonExist = true;
      }
      state.config.changesExist = true;
    },
    connectCategoryToPrompt: (state, action: PayloadAction<{ categoryId: number; promptId: number }>) => {
      const prompt = state.config.prompts.find((el) => el.id === action.payload.promptId);
      const category = state.config.categories.find((el) => el.id === action.payload.categoryId);
      if (!prompt || !category) return;
      category.prompt = cloneDeep(prompt);
      category.changed = true;
      if (prompt.id < 0) {
        category.containeNonExist = true;
      }
      state.config.changesExist = true;
    },

    updatePrompt: (state, action: PayloadAction<{ id: number; data: Partial<TPromt> }>) => {
      let index = state.config.prompts.findIndex((el) => el.id === action.payload.id);
      const prompt = state.config.prompts[index];
      if (prompt) {
        state.config.prompts[index] = { ...prompt, ...action.payload.data };
        state.config.prompts[index].changed = true;
        state.config.changesExist = true;
      }
    },
    updateCategory: (state, action: PayloadAction<{ id: number; data: Partial<TCategore> }>) => {
      let index = state.config.categories.findIndex((el) => el.id === action.payload.id);
      const category = state.config.categories[index];
      if (category) {
        state.config.categories[index] = { ...category, ...action.payload.data };
        state.config.categories[index].changed = true;
        state.config.changesExist = true;
      }
    },

    addPrompt: (state, action: PayloadAction<TPromt>) => {
      state.config.prompts.push(action.payload);
      state.config.changesExist = true;
    },
    setSplitter: (state, action: PayloadAction<{ id: number; value: string }>) => {
      const categ = state.config.categories.find((el) => el.id === action.payload.id);
      if (categ) {
        categ.splitterConfig = action.payload.value;
        categ.changed = true;
        state.config.changesExist = true;
      }
    },
    setKeynum: (state, action: PayloadAction<{ id: number; value: number }>) => {
      const categ = state.config.categories.find((el) => el.id === action.payload.id);
      if (categ) {
        categ.kNum = action.payload.value;
        categ.changed = true;
        state.config.changesExist = true;
      }
    },
    setThreshold: (state, action: PayloadAction<{ id: number; value: number }>) => {
      const categ = state.config.categories.find((el) => el.id === action.payload.id);
      if (categ) {
        categ.threshold = action.payload.value;
        categ.changed = true;
        state.config.changesExist = true;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchBots.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBots.fulfilled, (state, action) => {
      state.botsList = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchCategories.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(fetchConfig.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.config = action.payload;
    });
  },
});

export const {
  setActiveBot,
  setShowEditWindow,
  setEditTarget,
  setConfigBotField,
  setConfigBotOrgId,
  setConfigBotModelId,
  setFile,
  setImportFile,
  setPromptById,
  changeBotPromptText,
  addPackage,
  markAsDeletedCategory,
  setSplitter,
  changeBotPhone,
  changeBotModel,
  setKeynum,
  setThreshold,
  addFile,
  addPrompt,
  addCategory,
  setChatBotWidgetVisible,
  setChatBotWidgetHidden,
  setShowConfirmDeleteWindow,
  setConfigChangesExist,
  resetConfig,
  changeCategoryName,
  setChatIsOpened,
  addNewFile,
  cleanFileById,
  cloneCategory,
  addNewIndependentFile,
  showExistingIndependentFile,
  addNewIndependentPrompt,
  showExistingIndependentPrompt,
  connectCategoryToFile,
  connectCategoryToPrompt,
  markAsDeletedIndependentCategory,
  markAsDeletedIndependentFile,
  markAsDeletedIndependentPrompt,
  updatePrompt,
  updateCategory,
} = botSlice.actions;
export const botsReducer = botSlice.reducer;
