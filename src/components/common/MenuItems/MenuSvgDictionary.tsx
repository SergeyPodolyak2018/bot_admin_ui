import Add from '../../../assets/svg/Add.svg';
import GreenCircleSvg from '../../../assets/svg/greenCircle.svg';
import WebCallSvg from '../../../assets/svg/options/call.svg';
import DashBoardSvg from '../../../assets/svg/options/dashboard.svg';
import DeleteSvg from '../../../assets/svg/options/delete.svg';
import DrawSvg from '../../../assets/svg/options/draw.svg';
import EditSvg from '../../../assets/svg/options/edit.svg';
import InviteSvg from '../../../assets/svg/options/invite.svg';
import ChatSvg from '../../../assets/svg/options/post.svg';
import SettingsSvg from '../../../assets/svg/options/settings.svg';
import RedCircleSvg from '../../../assets/svg/redCircle.svg';
import DuplicateSvg from '../../../assets/svg/options/duplicate.svg';

export const menuItemsSvg: Record<string, string> = {
  Remove: DeleteSvg,
  Edit: EditSvg,
  'Beta config': EditSvg,
  Settings: SettingsSvg,
  Invite: InviteSvg,
  Rename: EditSvg,
  'Advanced Config': SettingsSvg,
  Delete: DeleteSvg,
  'Create From Template': DashBoardSvg,
  'Create From Scratch': DrawSvg,
  Chat: ChatSvg,
  'Web Call': WebCallSvg,
  Activate: GreenCircleSvg,
  Deactivate: RedCircleSvg,
  Suspend: DeleteSvg,
  'Add right': Add,
  Widgets: SettingsSvg,
  Duplicate: DuplicateSvg,
};
