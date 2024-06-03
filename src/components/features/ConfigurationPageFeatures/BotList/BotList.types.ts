export type BotListProps = {
  onClickEditBot: (botId: number) => void;
  onClickDeleteBot: (botId: number, isOwner: boolean, name: string) => void;
};
