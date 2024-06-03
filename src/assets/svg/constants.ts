import { getUIRoot } from 'config';
import { NavigationEnum } from 'navigation';
import AgentsIcon from './agents.svg';
import ActiveCallsIcon from './activecalls.svg';
import BillingIcon from './billing.svg';
import OrganizationsIcon from './organizations.svg';
import TemplatesIcon from './dashboard.svg';
import PhoneNumbersIcon from './dialpad.svg';
// todo: Home page icon
// import Home from '../svg/Home.svg';
// import DashBoardSvg from '../../../../../assets/svg/options/dashboard.svg';

export const ROOT = getUIRoot();

export const NAVIGATION_LIST = [
  // todo: Home page item
  // {
  //   title: 'Home',
  //   link: NavigationEnum.DASHBOARD,
  //   icon: Home,
  // },
  {
    title: 'AI Agents',
    link: NavigationEnum.AI_AGENT,
    icon: AgentsIcon,
  },
  {
    title: 'Interactions',
    link: NavigationEnum.INTERACTIONS,
    icon: ActiveCallsIcon,
  },
  // {
  //   title: 'Statistics',
  //   link: NavigationEnum.STATISTICS,
  //   icon: `/statistic.svg`,
  // },
  {
    title: 'Billing',
    link: NavigationEnum.BILLINGS,
    icon: BillingIcon,
  },
  {
    title: 'Organizations',
    link: NavigationEnum.ORGANISATIONS,
    icon: OrganizationsIcon,
  },
  {
    title: 'Templates',
    link: NavigationEnum.TEMPLATES,
    icon: TemplatesIcon,
    entity: 'template',
    privileges: ['canRead'],
  },
  {
    title: 'Phone Numbers',
    link: NavigationEnum.PHONES,
    icon: PhoneNumbersIcon,
  },
];
