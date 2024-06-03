export type Call = {
  id: string;
  call_status: string;
  type: string;
  bot_id?: number;
  user_id?: number;
  other_status?: {
    text_sent_to_model?: CallMessage[];
  };
};

export type CallStatuses = {
  [id: string]: CallStats;
};

export type CallStats = {
  id: string;
  playing_audio: string[];
  other_status: CallOtherStats;
  call_status: 'STARTED' | 'in_progress' | 'FINISHED';
  audio_status: AudioStats;
  speaking_now: string | null;
  start_time: string;
  fromNumber?: string;
  fromCity?: string;
  fromCountry?: string;
  fromState?: string;
  fromZip?: string;
  to?: string;
  toCity?: string;
  toCountry?: string;
  toState?: string;
  type: string;
  toZip?: string;
  time_end?: number | string;
  full_audio_link?: string;
};

export type CallOtherStats = {
  text_sent_to_model: CallMessage[];
};

export type CallMessage = {
  time_stamp: number;
  text: string;
  type: 'question' | 'answer';
  audio_link?: string;
};

export type AudioStats = {
  last_silence_start: number;
  total_silence_duration: number;
  last_text: string;
  last_event: 'voice' | 'silence';
  talking_now: boolean;
  waveformData: number[];
  waveformData2?: number[];
  ms_in_one_chunk?: number;
};
