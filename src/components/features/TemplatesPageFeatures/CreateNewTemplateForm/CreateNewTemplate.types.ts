export interface TApplyCreateBot {
  botId: string;
  typeId: number;
  description: string;
  isActive: boolean;
}
export interface CreateNewOrgFormProps {
  onClose: () => void;
  onApply: (param: TApplyCreateBot) => void;
}
