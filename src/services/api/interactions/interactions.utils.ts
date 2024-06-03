import { BuildUrlArgs } from 'services/api/interactions/interactions.types.ts';

export const buildUrl = ({ baseURL, sortField, sortOrder, size, page, filter }: BuildUrlArgs): string => {
  const getValue = (value: any) => (value !== undefined ? `:${Array.isArray(value) ? value.join(',') : value}` : '');

  let filterQuery = filter.map(({ rule, key, value }) => `filter=${key}:${rule}${getValue(value)}`).join('&');
  filterQuery = filterQuery ? `&${filterQuery}` : '';

  const sortQuery = `sort=${sortField}:${sortOrder}`;
  const pageQuery = `page=${page}`;
  const sizeQuery = `size=${size}`;

  return `${baseURL}?${sortQuery}&${pageQuery}&${sizeQuery}${filterQuery}`;
};
