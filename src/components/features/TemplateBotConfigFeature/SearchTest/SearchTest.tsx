// import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { CSSProperties, FC, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStateRef from 'react-usestateref';
import { SEARCH_TEST } from 'services';
import { addNotification, useAppDispatch } from 'store';
import { TimeoutId } from 'types';
import { useSocket } from 'utils/hooks';
import logger from '../../../../utils/logger.ts';
import { Button as TryItNowButton, Loader } from '../../../common/index.ts';
import styles from './templateConfiguration.module.scss';

interface ITableRow {
  id: string;
  document: string;
  distance: number;
  score_distance: number;
  score_bm25: number;
  score_rerank: number;
  metadata: any;
}

interface SearchTestProps {
  style?: CSSProperties;
}

export const SearchTest: FC<SearchTestProps> = ({ style = {} }) => {
  const dispatch = useAppDispatch();
  const { botId } = useParams();

  const [, setResponseText, responseTextRef] = useStateRef<string | null>(null);
  const [st, setSt] = useState<ITableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const timerRef = useRef<TimeoutId | null>(null);

  const TO_FIXED = 3;

  const showMessage = (data: any) => {
    const arr_excepted = data.result.filter((a: any) => a.metadata!.threshold <= a.distance);
    const arr_includes = data.result.filter((a: any) => a.metadata!.threshold > a.distance);

    setSt([...arr_excepted, ...arr_includes] as ITableRow[]);
  };

  const { socketRef, retryConnect, wsSend } = useSocket({
    url: SEARCH_TEST,
    initOnLoad: true,
    onClose: () => {
      logger.info(`WebSocket connection closed to ${SEARCH_TEST}`);
      timerRef.current = setTimeout(() => retryConnect(), 5000);
      setLoading(false);
    },
    onOpen: () => {
      logger.info(`open WebSocket connection to ${SEARCH_TEST}`);
      setLoading(false);
    },
    onError: (msg) => {
      logger.error(`WebSocket connection error to ${SEARCH_TEST}`);
      socketRef.current?.close();
      setLoading(false);
      const message = typeof msg === 'string' ? msg : '';
      dispatch(addNotification({ type: 'error', title: 'Connection error', message }));
    },
    onConnect: () => {
      logger.info(`WebSocket connected to ${SEARCH_TEST}`);
    },
    onMessage: (event: any) => {
      const data = JSON.parse(event.data);

      if (data.text) {
        showMessage(data.text);
        setLoading(false);
      }

      if (data.isEnd && !data.text) {
        dispatch(addNotification({ type: 'error', title: 'Error', message: 'Response empty' }));
      }
      if (data.isEnd && responseTextRef.current) {
        setResponseText(null);
      }
    },
    cleanup: () => {
      timerRef.current && clearTimeout(timerRef.current);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question) {
      return;
    }

    try {
      setLoading(true);
      wsSend({ text: question, botId });
      setTimeout(() => {
        setLoading(false);
      }, 150);
    } catch (e: unknown) {
      logger.error(`sendBySocket() =>`, e);
    }
  };

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const getRowClass = (item: ITableRow) => {
    return item.metadata!.threshold <= item.distance ? { backgroundColor: '#eeeeee' } : {};
  };

  return (
    <div className={styles.container} style={{ ...style }}>
      {/*<div className={styles.mainHeader}>{t('TemplateBotConfig.searchTest')}</div>*/}
      {loading && <Loader type={'full-page'} />}
      <form onSubmit={handleSubmit} style={{ marginTop: '25px' }}>
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center' }}>
          <FormControl sx={{ width: '100%', height: '100%' }}>
            <TextField
              id={'question'}
              name={'question'}
              label={'Text Search'}
              variant="outlined"
              multiline={true}
              size={'small'}
              style={{ width: '100%' }}
              onKeyDown={handleKeyPress}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </FormControl>
          <div className={styles.footer}>
            <TryItNowButton label={'Send'} style={{ width: '100px', height: '32px' }} type="submit" />
          </div>
        </div>
      </form>

      <TableContainer
        component={Paper}
        sx={{
          minWidth: 120,
          width: '100%',
          marginTop: '50px',
          height: 'calc(100% - 50px)',
        }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className={styles.expandTable}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F6F9FF', height: '47px' }}>
              <TableCell align="center">Document</TableCell>
              <TableCell align="center">Output</TableCell>
              <TableCell align="center" style={{ width: 50 }}>
                Distance
              </TableCell>
              <TableCell align="center" style={{ width: 50 }}>
                Score Vector
              </TableCell>
              <TableCell align="center" style={{ width: 50 }}>
                Score BM25
              </TableCell>
              <TableCell align="center" style={{ width: 50 }}>
                Re-rank Score
              </TableCell>
              <TableCell align="center" style={{ width: 100 }}>
                Category
              </TableCell>
              <TableCell align="center" style={{ width: 50 }}>
                Threshold
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {st.map((row: ITableRow) => {
              return (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  style={getRowClass(row)}>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {row.document}
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {row.metadata.output || ''}
                  </TableCell>
                  <TableCell align="right" style={{ padding: '5px', height: '40px' }}>
                    {row.distance.toFixed(TO_FIXED)} ({((1 - row.distance) * 100).toFixed(2)}%)
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {row.score_distance.toFixed(TO_FIXED)}
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {row.score_bm25.toFixed(TO_FIXED)}
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {(row.score_rerank * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {row.metadata.category!}
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px', height: '40px' }}>
                    {row.metadata.threshold!}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
