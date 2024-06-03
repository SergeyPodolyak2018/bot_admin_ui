export interface InviteMemberFormProps {
  onClose: () => void;
  onApply: (email: string) => void;
  onChange: () => void;
  error: string;
  existingUser: boolean;
}
