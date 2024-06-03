import { createElement, SyntheticEvent, useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { a11yProps } from './utils.ts';
import { CustomTabPanel } from './CustomTabPanel.tsx';
import { Tab as TabType } from './BillingTabs.types.ts';
import { BillingHistory, PaymentMethods } from 'components/features';

export const BillingTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const _tabs: TabType[] = [
    {
      label: 'Payment methods',
      el: PaymentMethods,
    },
    {
      label: 'Billing history',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      el: BillingHistory,
    },
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleChange} aria-label="tabs">
          {_tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {_tabs.map((_tab, index) => (
        <CustomTabPanel key={index} index={index} value={activeTab} {...a11yProps(index)}>
          {createElement(_tab.el)}
        </CustomTabPanel>
      ))}
    </>
  );
};
