export type InitBotPayload = {
  botId: string | number;
  chatId?: string | number;
  waitMs?: number;
};

export type ClearBotPayload = InitBotPayload;

export type AskBotPayload = InitBotPayload & {
  question: string;
};

export type AskBotResponse = {
  bot_id: string;
  chat_id: string | '_';
  answer: string; // "Washing Up Liquid 750 ml United Kingdom 4.05 €\nDishwasher Rinse Aid",
  embedding_time: number; // 371.2553849220276,
  category: string; // "remarks_test",
  first_token_time: number; // 0,
  first_token_text: string; // "",
  total_time: number; // 371.25628900527954,
  conversation: string | null;
};
