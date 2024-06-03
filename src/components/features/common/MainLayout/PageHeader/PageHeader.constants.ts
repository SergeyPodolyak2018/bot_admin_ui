import { PageHeaderContent } from 'components/features/common/MainLayout/PageHeader/PageHeader.types.ts';
import { NavigationEnum } from 'navigation';

export const pageHeaderContent: PageHeaderContent = {
  [NavigationEnum.AI_AGENT]: {
    title: 'AI Agents',
    subtitle: 'Use our recommendations to create a high-quality agent.',
  },
  [NavigationEnum.CREATE_BOT]: {
    title: 'AI Agents',
    subtitle: 'Use our recommendations to create a high-quality agent.',
  },
  [NavigationEnum.INTERACTIONS]: {
    title: 'Interactions',
    subtitle: 'See types of user interactions with AI Agent.',
  },
  // [`${NavigationEnum.AI_AGENT_CONFIG}/:id`]: {
  //   title: 'AI Agents',
  //   subtitle: 'Use our recommendations to create a high-quality agent.',
  // },
  // uncomment if need enable in interaction details page
  // [`${NavigationEnum.INTERACTIONS}/:id`]: {
  //   title: 'Interaction',
  //   subtitle: 'See types of user interactions with AI Agent.',
  // },
  [`${NavigationEnum.AI_WIDGET}/:id`]: {
    title: 'Widget Configuration',
    subtitle: 'Customize the widget as you wish.',
  },
  [`${NavigationEnum.BILLINGS}`]: {
    title: 'Billing Details',
    subtitle: 'Choose the plan that works for you.',
  },
  [`${NavigationEnum.ORGANISATIONS}`]: {
    title: 'Organizations',
    subtitle: 'Use our recommendations to create a high-quality agent.',
  },
  // [`${NavigationEnum.AI_AGENT_TEMPLATE}`]: {
  //   title: 'Templates',
  //   subtitle: 'Use ready-made bots from our templates for your field of activity.',
  // },
  [`${NavigationEnum.PROFILE}`]: {
    title: 'Profile Settings',
    subtitle: 'Update your profile information here',
  },
  [`${NavigationEnum.PHONES}`]: {
    title: 'Phone Numbers',
    subtitle: 'Pick up your phone numbers.',
  },
  [`${NavigationEnum.DASHBOARD}`]: {
    title: 'Home',
    subtitle: 'View AI Agents interaction statistic',
  },
};
