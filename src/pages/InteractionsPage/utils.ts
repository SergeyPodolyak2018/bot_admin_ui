import { Columns, FilterOption } from 'components/common';
import { InteractionsFilter } from 'pages/InteractionsPage/InteractionsPage.tsx';
import { Filter } from 'services/api';
import { BotShort, FilterRule, TOrganisation } from 'types';

export const getTableColumns = (
  countries: string[],
  organizations: TOrganisation[],
  bots: BotShort[],
  filter: InteractionsFilter,
  onClickAllChecked: (key: string, values: string[]) => void,
): Columns => {
  const orgFilter = getOrganizationFilterOptions(organizations);
  const botsFilter = getBotsFilterOptions2(bots);
  const countriesFilter = getCountriesFilterOptions2(countries);

  const sentimentsFilter = [
    {
      label: 'Positive',
      value: 'positive',
    },
    {
      label: 'Neutral',
      value: 'neutral',
    },
    {
      label: 'Negative',
      value: 'negative',
    },
    {
      label: 'Empty',
      value: 'empty',
    },
  ];
  const typeFilter = [
    {
      label: 'Voice',
      value: 'voice_chat',
    },
    {
      label: 'Chat',
      value: 'text_chat',
    },
    {
      label: 'Twilio',
      value: 'twilio_chat',
    },
  ];
  const doneFilter = [
    {
      label: 'Finished',
      value: 'true',
    },
    {
      label: 'Started',
      value: 'false',
    },
  ];
  const isAllOrgFilterChecked = filter.orgName.length === organizations.length;
  const isAllBotNameFilterChecked = filter.botName.length === botsFilter.length;
  const isAllCountriesFilterChecked = filter.country.length === countriesFilter.length;

  const isAllTypeFilterChecked = filter.type.length === typeFilter.length;
  const isAllDoneFilterChecked = filter.done.length === doneFilter.length;

  const isAllSentimentFilterChecked = filter.sentiment.length === sentimentsFilter.length;

  return [
    {
      width: 70,
      label: 'Organization',
      dataKey: 'orgName',
      filterOptions: orgFilter,
      sortable: true,
      allChecked: isAllOrgFilterChecked,
      disable: filter.orgName.length === 0,
      onClickAllChecked: () => {
        if (!isAllOrgFilterChecked) {
          onClickAllChecked(
            'orgName',
            orgFilter.map((item) => item.value),
          );
        } else {
          onClickAllChecked('orgName', []);
        }
      },
    },
    {
      width: 160,
      label: 'Agent Name',
      dataKey: 'botName',
      filterOptions: botsFilter,
      sortable: true,
      disable: filter.botName.length === 0,
      allChecked: isAllBotNameFilterChecked,
      onClickAllChecked: () => {
        if (!isAllBotNameFilterChecked) {
          onClickAllChecked(
            'botName',
            botsFilter.map((item) => item.value),
          );
        } else {
          onClickAllChecked('botName', []);
        }
      },
    },
    {
      width: 80,
      label: 'Country',
      dataKey: 'country',
      filterOptions: countriesFilter,
      sortable: true,
      disable: filter.country.length === 0,
      allChecked: isAllCountriesFilterChecked,
      onClickAllChecked: () => {
        if (!isAllCountriesFilterChecked) {
          onClickAllChecked(
            'country',
            countriesFilter.map((item) => item.value),
          );
        } else {
          onClickAllChecked('country', []);
        }
      },
    },
    {
      width: 200,
      label: 'Topic',
      dataKey: 'topics',
      sortable: true,
    },
    {
      width: 70,
      label: 'Caller',
      dataKey: 'user',
      sortable: false,
    },
    {
      width: 70,
      label: 'Type',
      dataKey: 'type',
      allChecked: isAllTypeFilterChecked,
      filterOptions: typeFilter,
      disable: filter.type.length === 0,
      onClickAllChecked: () => {
        if (!isAllTypeFilterChecked) {
          onClickAllChecked(
            'type',
            typeFilter.map((item) => item.value),
          );
        } else {
          onClickAllChecked('type', []);
        }
      },
      sortable: true,
    },
    {
      width: 30,
      label: 'Status',
      dataKey: 'done',
      allChecked: isAllDoneFilterChecked,
      filterOptions: doneFilter,
      disable: filter.done.length === 0,
      onClickAllChecked: () => {
        if (!isAllDoneFilterChecked) {
          onClickAllChecked(
            'done',
            doneFilter.map((item) => item.value),
          );
        } else {
          onClickAllChecked('done', []);
        }
      },
      sortable: true,
    },
    {
      width: 75,
      label: 'Messages',
      dataKey: 'countMessages',
      sortable: true,
    },
    {
      width: 140,
      label: 'Start time',
      dataKey: 'startTimestamp',
      sortable: true,
    },
    {
      width: 35,
      label: 'Duration',
      dataKey: 'duration',
      sortable: true,
    },
    {
      width: 80,
      label: 'Sentiment',
      dataKey: 'sentiment',
      sortable: true,
      filterOptions: sentimentsFilter,
      allChecked: isAllSentimentFilterChecked,
      disable: filter.sentiment.length === 0,
      onClickAllChecked: () => {
        if (!isAllSentimentFilterChecked) {
          onClickAllChecked(
            'sentiment',
            sentimentsFilter.map((item) => item.value),
          );
        } else {
          onClickAllChecked('sentiment', []);
        }
      },
    },
  ];
};

export const getCountriesFilterOptions2 = (countries: string[]): FilterOption[] => {
  const mySet1 = new Set();
  const filter: FilterOption[] = [];
  for (const iterator of countries) {
    mySet1.add(iterator);
  }
  for (const item of mySet1.keys()) {
    filter.push({
      label: item as string,
      value: item as string,
    });
  }
  return filter;
};
export const getBotsFilterOptions2 = (bots: BotShort[]): FilterOption[] => {
  const mySet1 = new Set();
  const botsfiltr: FilterOption[] = [];
  for (const iterator of bots) {
    mySet1.add(iterator.name);
  }
  for (const item of mySet1.keys()) {
    botsfiltr.push({
      label: item as string,
      value: item as string,
    });
  }
  return botsfiltr;
};
export const getBotsUnicNames = (bots: BotShort[]): { name: string }[] => {
  const mySet1 = new Set();
  const botsfiltr: { name: string }[] = [];
  for (const iterator of bots) {
    mySet1.add(iterator.name);
  }
  for (const item of mySet1.keys()) {
    if (item) {
      const name = item as string;
      botsfiltr.push({
        name,
      });
    }
  }
  return botsfiltr;
};

export const getOrganizationFilterOptions = (organizations: TOrganisation[]): FilterOption[] => {
  return organizations.map((org) => ({
    label: org.name,
    value: org.name,
  }));
};

type PartialWithRequired<T, K extends keyof T> = Pick<T, K> & Partial<T>;

export const getBotsFilterOptions = (bots: PartialWithRequired<BotShort, 'name'>[]): FilterOption[] => {
  return bots.map((b) => ({
    label: b.name,
    value: b?.name,
  }));
};

export const getCountriesFilterOptions = (countries: string[]): FilterOption[] => {
  return countries.map((str) => ({
    label: str,
    value: str,
  }));
};

export const getFilterValues = (
  filterVal: InteractionsFilter,
  searchStr: string,
  organizations: TOrganisation[],
  bots: Partial<BotShort>[],
  countries: string[],
) => {
  const doneFilterValue = [];
  filterVal.done.indexOf('true') !== -1 && doneFilterValue.push('1');
  filterVal.done.indexOf('false') !== -1 && doneFilterValue.push('0');

  const typeFilterValue = [];
  filterVal.type.indexOf('voice_chat') !== -1 && typeFilterValue.push('voice_chat');
  filterVal.type.indexOf('text_chat') !== -1 && typeFilterValue.push('text_chat');
  filterVal.type.indexOf('twilio_chat') !== -1 && typeFilterValue.push('twilio_chat');

  const filter: Filter[] = [];
  if (doneFilterValue.length) {
    filter.push({
      key: 'done',
      rule: FilterRule.In,
      value: doneFilterValue,
    });
  }
  if (typeFilterValue.length) {
    filter.push({
      key: 'type',
      rule: FilterRule.Like,
      value: typeFilterValue,
    });
  }
  if (searchStr) {
    filter.push({
      key: 'search',
      value: [searchStr],
      rule: FilterRule.Like,
    });
  }
  if (filterVal.orgName.length && filterVal.orgName.length !== organizations.length) {
    filter.push({
      key: 'orgName',
      rule: FilterRule.Like,
      value: filterVal.orgName,
    });
  }

  if (filterVal.botName.length && filterVal.botName.length !== bots.length) {
    filter.push({
      key: 'botName',
      rule: FilterRule.Like,
      value: filterVal.botName,
    });
  }

  if (filterVal.country.length && filterVal.country.length !== countries.length) {
    filter.push({
      key: 'country',
      rule: FilterRule.Like,
      value: filterVal.country,
    });
  }

  if (filterVal.sentiment.length && filterVal.sentiment.length !== bots.length) {
    const emptyIndex = filterVal.sentiment.findIndex((item) => item === 'empty');
    if (emptyIndex !== -1) {
      filter.push({
        key: 'sentiment',
        rule: FilterRule.IsNull,
      });
    }
    const value = filterVal.sentiment.filter((item) => item !== 'empty');
    value.length &&
      filter.push({
        key: 'sentiment',
        rule: FilterRule.Like,
        value,
      });
  }
  return filter;
};
