import { Root } from 'components/features';
import {
  BillingPage,
  BotsPage,
  ChangeBotConfigPage,
  CreateBotPage,
  CreateBotTemplate,
  CreateBotTemplateFromGroup,
  InteractionDetailsPage,
  InteractionsPage,
  LandingPage,
  LoginPage,
  OrganisationsPage,
  PhoneNumbersPage,
  Profile,
  RegistrationPage,
  StatisticsPage,
  TemplateBotConfigPage,
  TemplatesPageTabs,
  WidgetPage,
  WidgetsPage,
  DashboardPage,
} from 'pages';
import { TestNotification } from 'pages/TestNotification/TestNotification.tsx';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route } from 'react-router-dom';

import { NavigationEnum } from './config';

export const BrowserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Outlet />}>
      <Route path={NavigationEnum.LANDING_PAGE} element={<LandingPage />} />
      <Route path={NavigationEnum.SIGN_UP} element={<RegistrationPage />} />
      <Route path={NavigationEnum.LOGIN} element={<LoginPage />} />
      <Route path={NavigationEnum.TEST_NOTIFICATION} element={<TestNotification />} />
      {/*<Route path={NavigationEnum.TEST_RECORD_RTC} element={<TestRecordRTC />} />*/}

      <Route element={<Root />} path={NavigationEnum.ROOT}>
        <Route path={NavigationEnum.AI_AGENT} element={<BotsPage />} />
        <Route path={`${NavigationEnum.AI_AGENT_TEMPLATE}`} element={<CreateBotTemplate />} />
        <Route path={`${NavigationEnum.AI_AGENT_TEMPLATE}/:groupId`} element={<CreateBotTemplateFromGroup />} />
        <Route path={`${NavigationEnum.AI_AGENT_CONFIG}/:botId`} element={<TemplateBotConfigPage />} />
        {/* <Route path={`${NavigationEnum.AI_AGENT}/:botId`} element={<ChangeBotConfigPage />} /> */}
        <Route path={NavigationEnum.INTERACTIONS} element={<InteractionsPage />} />
        <Route path={`${NavigationEnum.INTERACTIONS}/:id`} element={<InteractionDetailsPage />} />
        <Route path={`${NavigationEnum.WIDGET}/:botId`} element={<WidgetPage />} />
        <Route path={NavigationEnum.STATISTICS} element={<StatisticsPage />} />
        <Route path={NavigationEnum.BILLINGS} element={<BillingPage />} />
        <Route path={NavigationEnum.ORGANISATIONS} element={<OrganisationsPage />} />
        <Route path={NavigationEnum.TEMPLATES} element={<TemplatesPageTabs />} />
        <Route path={NavigationEnum.CREATE_BOT} element={<CreateBotPage />} />
        <Route path={NavigationEnum.PROFILE} element={<Profile />} />
        <Route path={`${NavigationEnum.AI_WIDGET}/:botId`} element={<WidgetsPage />} />
        <Route path={`${NavigationEnum.PHONES}`} element={<PhoneNumbersPage />} />
        <Route path={`${NavigationEnum.DASHBOARD}`} element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Route>,
  ),
);
