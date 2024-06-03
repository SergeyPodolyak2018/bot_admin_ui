import Pagination from '@mui/material/Pagination';
import { Columns, Dropdown, EmptyPlaceholder, InputSearch } from 'components/common';
import { InteractionTable } from 'components/features';
import {
  getBotsFilterOptions,
  getBotsUnicNames,
  getFilterValues,
  getOrganizationFilterOptions,
  getTableColumns,
} from 'pages/InteractionsPage/utils.ts';
import { useEffect, useMemo, useRef } from 'react';
import { Filter } from 'services/api';
import {
  addNotification,
  allBotsSelector,
  decLoaderCountAction,
  fetchBots,
  incLoaderCountAction,
  selectOrganisations,
  selectShowLoading,
  useAppDispatch,
  useAppSelector,
  //interactions part
  selectSelectedOption,
  selectSearchStr,
  selectFilter,
  selectSortField,
  selectSortOrder,
  selectPage,
  selectPages,
  selectTotalItems,
  selectInteractions,
  selectPrevFilter,
  selectInteractionLoading,
  selectShowPlaceholder,
  //interactions slice part
  setSelectedOption,
  setSearchStr,
  setFilter,
  setSortField,
  setSortOrder,
  setPage,
  setPrevFilter,
  fetchInteractions,
  revertFilter,
  setFilterBufer,
  selectCountries,
  fetchCountries,
} from 'store';
import { Interaction, InteractionFields, Order, TimeoutId } from 'types';
import logger from 'utils/logger.ts';
import NoInteractionsIcon from '../../assets/svg/noInteractionsIcon.svg';
import styles from './InteractionsPage.module.scss';
import './InteractionsPage.vars.scss';
import { makeStyles } from '@material-ui/core/styles';

export type InteractionsFilter = {
  orgName: string[];
  botName: string[];
  type: string[];
  done: string[];
  sentiment: string[];
  country: string[];
};

const useStyles = makeStyles(() => ({
  ul: {
    '& .MuiPaginationItem-root': {
      color: 'rgba(31, 31, 31, 1)',
    },
    '& .MuiPaginationItem-root.Mui-selected': {
      color: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(31, 31, 31, 1)',
      borderColor: 'rgba(31, 31, 31, 1)',
      '&:hover': {
        color: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(31, 31, 31, 1)',
        borderColor: 'rgba(31, 31, 31, 1)',
      },
    },
  },
}));

export const InteractionsPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganisations);
  const bots = useAppSelector(allBotsSelector);

  const loader = useAppSelector(selectShowLoading);
  const selectedOption = useAppSelector(selectSelectedOption);
  const searchStr = useAppSelector(selectSearchStr);
  const filter = useAppSelector(selectFilter);
  const sortField = useAppSelector(selectSortField);
  const sortOrder = useAppSelector(selectSortOrder);
  const page = useAppSelector(selectPage);
  const pages = useAppSelector(selectPages);
  const totalItems = useAppSelector(selectTotalItems);
  const interactions = useAppSelector(selectInteractions);
  const countries = useAppSelector(selectCountries);
  const prevFilter = useAppSelector(selectPrevFilter);
  const uploaded = useAppSelector(selectInteractionLoading);
  const showPlaceholder = useAppSelector(selectShowPlaceholder);

  // apply filter
  useEffect(() => {
    if (uploaded) return;

    const filterVal = getFilterValues(filter, searchStr, organizations, getBotsUnicNames(bots), countries);

    if (prevFilter === JSON.stringify(filterVal)) return;

    fetchInteractionsLocal(filterVal, sortOrder, sortField, page);
  }, [filter, sortOrder, sortField, page, selectedOption]);

  useEffect(() => {
    dispatch(fetchBots());
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    // if (firstRender) return;
    if (uploaded) return;
    if (organizations.length === 0 || bots.length === 0) return;

    const orgFilter = getOrganizationFilterOptions(organizations);
    const botsFilter = getBotsFilterOptions(getBotsUnicNames(bots));
    const orgName = orgFilter.map((o) => o.value) || [];
    const botName = botsFilter.map((o) => o.value) || [];
    //console.log(filter);
    dispatch(setFilter({ ...filter, orgName, botName, country: countries }));
    dispatch(setFilterBufer());
    // setFirstRender(true);
  }, [organizations, bots, countries]);

  useEffect(() => {
    const filterVal = getFilterValues(filter, searchStr, organizations, getBotsUnicNames(bots), countries);
    const correctedPage = pageCorrector(page, Number(selectedOption.value), totalItems);
    setPage(correctedPage);
    fetchInteractionsLocal(filterVal, sortOrder, sortField, correctedPage);
  }, [selectedOption]);

  // search
  const searchTimeout = useRef<TimeoutId | null>(null);
  useEffect(() => {
    const filterVal = getFilterValues(filter, searchStr, organizations, getBotsUnicNames(bots), countries);
    if (!prevFilter || prevFilter === JSON.stringify(filterVal)) return;

    searchTimeout.current && clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchInteractionsLocal(filterVal, sortOrder, sortField, page), 1000);
  }, [searchStr, prevFilter]);

  // region prepare columns
  const handleClickShowAllCheckbox = (key: string, values: string[]) => {
    dispatch(
      setFilter({
        ...filter,
        [key]: values,
      }),
    );
  };
  const tableColumns: Columns = useMemo(
    () => getTableColumns(countries, organizations, bots, filter, handleClickShowAllCheckbox),
    [organizations, bots, filter],
  );
  // const tableColumns: Columns = getTableColumns(organizations, bots, filter, handleClickShowAllCheckbox);

  // endregion

  const pageCorrector = (page: number, selectedOption: number, totalItems: number): number => {
    if (page === 1 && totalItems === 0) return page;
    const maxPages = Math.ceil(totalItems / selectedOption);
    if (maxPages < page) return maxPages;
    return page;
  };

  const fetchInteractionsLocal = async (
    filter: Filter[],
    sortOrder: Order,
    sortField: InteractionFields,
    page: number,
  ) => {
    dispatch(incLoaderCountAction());
    dispatch(setPrevFilter(JSON.stringify(filter)));
    dispatch(setFilterBufer());
    return dispatch(
      fetchInteractions({
        page: page,
        sortOrder: sortOrder,
        sortField: sortField,
        filter,
        size: +selectedOption.value,
      }),
    )
      .catch((err) => {
        dispatch(addNotification({ title: 'Error with get Interactions', message: err.message, type: 'error' }));
        logger.error(err);
      })
      .finally(() => {
        dispatch(decLoaderCountAction());
      });
  };

  const handleChangePage = (page: number) => {
    const filterVal = getFilterValues(filter, searchStr, organizations, getBotsUnicNames(bots), countries);
    fetchInteractionsLocal(filterVal, sortOrder, sortField, page);
    //setUploaded(true);
    dispatch(setPage(page));
  };

  const handleChangeSort = (orderBy: keyof Interaction, order: Order) => {
    const filterVal = getFilterValues(filter, searchStr, organizations, getBotsUnicNames(bots), countries);
    fetchInteractionsLocal(filterVal, order, orderBy, page);

    dispatch(setSortOrder(order));
    dispatch(setSortField(orderBy as keyof Interaction));
  };

  if (!uploaded) return <></>;
  if (showPlaceholder || (!uploaded && loader)) return <EmptyPlaceholder text={'Interaction empty'} icon={'shield'} />;
  return (
    <div className={styles.container}>
      <>
        <div className={styles.header}>
          {/*<div className={styles.title}>{t('callingListPageFeature.interactions')}</div>*/}
          <InputSearch
            style={{ width: '324px' }}
            placeholder={'Search'}
            value={searchStr}
            onChange={(event) => {
              dispatch(setSearchStr(event.target.value));
            }}
          />
        </div>
        <div className={styles.table}>
          <InteractionTable
            applyFilter={() => {
              const filterVal = getFilterValues(filter, searchStr, organizations, getBotsUnicNames(bots), countries);
              if (prevFilter === JSON.stringify(filterVal)) return;
              fetchInteractionsLocal(filterVal, sortOrder, sortField, 1);
              dispatch(setPage(1));
            }}
            closeFilter={() => {
              dispatch(revertFilter());
            }}
            tableColumns={tableColumns}
            setFilter={(filter) => dispatch(setFilter(filter))}
            filter={filter}
            interactions={interactions}
            sortOptions={{
              order: sortOrder,
              orderBy: sortField,
            }}
            onChangeSort={(orderBy, order) => {
              handleChangeSort(orderBy, order);
            }}
          />
        </div>
        {!interactions.length && !loader ? (
          <div className={styles.tempPlaceholder}>
            <div className={styles.intecationsPlaceholder}>
              <img className={styles.placeholderIcon} src={NoInteractionsIcon} alt="NoInteractionsIcon" />
              <span>No available records.</span>
            </div>
          </div>
        ) : (
          ''
        )}
        {!!interactions.length && (
          <div className={styles.paginationHolder}>
            <Pagination
              color={'secondary'}
              count={pages}
              page={page}
              onChange={(_e, page) => handleChangePage(page)}
              className={styles.pagination}
              classes={{ ul: classes.ul }}
            />
            <div className={styles.dropdownExplanation}>Show per page</div>
            <Dropdown
              styles={{ width: '47px', height: '32px', borderRadius: '10px' }}
              className={styles.dropdownCustom}
              subClassName={styles.dropdownCustomSelected}
              popUpClassName={styles.dropdownCustomPopUp}
              onChange={(option) => {
                dispatch(setSelectedOption(option));
                //localStorageSetItem('Interactions', option);
              }}
              selectedOption={selectedOption}
              options={[
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '50', value: '50' },
              ]}
            />
          </div>
        )}
      </>
    </div>
  );
};
