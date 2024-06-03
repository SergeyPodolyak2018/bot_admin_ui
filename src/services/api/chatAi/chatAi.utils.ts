export const prepareUri = ({
  base,
  botId,
  chatId,
}: {
  base: string;
  botId: string | number;
  chatId?: string | number;
}) => {
  let uri = `${base}/${botId}`;
  if (chatId) uri = `${uri}/${chatId}`;
  return uri;
};
