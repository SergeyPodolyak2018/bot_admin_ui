import { TInteractionsData } from './interactions.types';
import { Order } from 'types';

export const initialInteractionsState: TInteractionsData = {
  page: 1,
  pages: 0,
  totalItems: 0,
  interactions: [],
  prevFilter: '',
  sortOrder: Order.DESC,
  sortField: 'startTimestamp',
  filter: {
    orgName: [],
    botName: [],
    type: ['text_chat', 'voice_chat', 'twilio_chat'],
    done: ['true', 'false'],
    sentiment: ['positive', 'neutral', 'negative', 'empty'],
    country: [],
  },
  filterBufer: {
    orgName: [],
    botName: [],
    type: ['text_chat', 'voice_chat', 'twilio_chat'],
    done: ['true', 'false'],
    sentiment: ['positive', 'neutral', 'negative', 'empty'],
    country: [],
  },
  searchStr: '',
  selectedOption: { label: '10', value: '10' },
  uploaded: false,
  showPlaceholder: false,
  countries: [],
};
