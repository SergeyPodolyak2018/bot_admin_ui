import { Columns } from 'components/common';
import { CSSProperties } from 'react';

export const cellStyles: CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  border: '1px solid #EAEEF4',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  textOverflow: 'ellipsis',
};
export const columns: Columns = [
  {
    width: 50,
    label: 'callingListPageFeature.botId',
    dataKey: 'bot_id',
    sortable: true,
  },
  {
    width: 50,
    label: 'callingListPageFeature.userId',
    dataKey: 'user_id',
    sortable: true,
  },
  {
    width: 50,
    label: 'callingListPageFeature.type',
    dataKey: 'type',
    sortable: true,
  },
  {
    width: 50,
    label: 'callingListPageFeature.status',
    dataKey: 'done',
    sortable: true,
  },
  {
    width: 50,
    label: 'callingListPageFeature.questions',
    dataKey: 'other_status.text_sent_to_model',
    sortable: true,
  },
  {
    width: 50,
    label: 'botList.id',
    dataKey: 'id',
    sortable: true,
  },
];
