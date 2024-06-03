import styles from './LastInteractionsWidget.module.scss';
import { WidgetWrapper } from '../common/WidgetWrapper/WidgetWrapper.tsx';
import { useEffect, useRef, useState } from 'react';
import { getNegativeInteractions, PERIOD } from '../../../../services/index.ts';
import { selectOrg, useAppSelector } from '../../../../store/index.ts';
import { Interaction, Order } from '../../../../types/index.ts';
import { InteractionTableLastInteractions } from '../common/InteractionTable/InteractionTableLastInteractions.tsx';

interface IProps {
  period: PERIOD;
  counter: number;
}
export const NegativeMentionsWidget = ({ period, counter }: IProps) => {
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef<any>(null);
  const org = useAppSelector(selectOrg);
  // const interactions = useAppSelector(selectInteractions);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loader, setLoader] = useState(false);
  const [order, setOrder] = useState<Order>(Order.DESC);
  const [page, setPage] = useState(1);
  const [init, setInit] = useState(false);
  const columns = [
    {
      width: 160,
      label: 'Agent Name',
      dataKey: 'botName',
    },
    {
      width: 30,
      label: 'Type',
      dataKey: 'type',
    },
    {
      width: 30,
      label: 'Caller',
      dataKey: 'caller',
    },
    {
      width: 30,
      label: 'Location',
      dataKey: 'location',
    },
    {
      width: 130,
      label: 'Start Time',
      dataKey: 'startTime',
      sortable: false,
    },
    {
      width: 200,
      label: 'Negative Messages',
      dataKey: 'negative',
      sortable: true,
    },
    {
      width: 50,
      label: 'Status',
      dataKey: 'status',
      sortable: false,
    },
    {
      width: 40,
      label: 'Duration',
      dataKey: 'duration',
      sortable: false,
    },
    {
      width: 130,
      label: 'Messages',
      dataKey: 'messages',
      sortable: false,
    },
  ];

  const fetchData = () => {
    if (loader) return;
    setLoader(true);
    getNegativeInteractions({
      organizationId: Number(org!.value),
      order: order,
      page: page,
      interval: period,
    }).then((r) => {
      if (!r.data.length) {
        setHasMore(false);
      } else {
        if (page === 1) setInteractions(r.data);
        else setInteractions((p) => [...p, ...r.data]);
      }
      setLoader(false);
      setInit(true);
    });
  };

  const handleScroll = () => {
    const rf = tableRef.current;
    if (rf && rf!.scrollHeight - rf!.scrollTop === rf!.clientHeight) {
      setPage((p) => p + 1);
    }
  };

  useEffect(() => {
    if (!init) {
      fetchData();
    }
  }, [init]);

  useEffect(() => {
    if (!init) return;
    if (!org) return;
    if (!hasMore) return;
    fetchData();
  }, [page]);

  useEffect(() => {
    if (!init) return;
    if (!loader) setInteractions([]);
    if (page > 1) {
      setHasMore(true);
      setPage(1);
    } else fetchData();
  }, [period, counter, order]);

  return (
    <WidgetWrapper classes={[styles.main]} title={'Negative Mentions'} infiniteScroll={loader}>
      <InteractionTableLastInteractions
        applyFilter={() => {
          return;
        }}
        tableColumns={columns}
        interactions={interactions || []}
        sortOptions={{
          order: order,
          orderBy: 'negative',
        }}
        onChangeSort={(column, or) => {
          setOrder(or);
        }}
        tableRef={tableRef}
        handleScroll={handleScroll}
      />
    </WidgetWrapper>
  );
};
