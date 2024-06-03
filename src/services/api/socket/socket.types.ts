export enum SOCKET_MESSAGE_EVENT {
  MEDIA = 'media',
  CONNECTED = 'connected',
  STATUS = 'status',
  MARK = 'mark',
  CLEAR = 'clear',
  STOP = 'stop',
}

export type MediaMessage = {
  chat_id: string;
  event: SOCKET_MESSAGE_EVENT;
  media: {
    payload: string;
  };
};
