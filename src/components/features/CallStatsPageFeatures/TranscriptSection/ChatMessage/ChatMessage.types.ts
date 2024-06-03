import { Interaction, InteractionMessage } from 'types';

export type IChatMessageProps = {
  message: InteractionMessage;
  index: number;
  isAutoScroll: boolean;
  interaction: Interaction;
  setActiveMessage: SetActiveMessageArgs;
  incoming: boolean;
  parentRef: any;
  avatarSrc: any;
  botAvatar: any;
};

export type SetActiveMessageArgs = (message: InteractionMessage, duration: number | null) => void;
