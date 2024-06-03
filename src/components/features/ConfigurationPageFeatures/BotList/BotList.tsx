import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { EmptyPlaceholder, Loader, MenuItems } from 'components/common';
import { NavigationEnum } from 'navigation';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBotById } from 'services/api/index.ts';
import { allBotsSelector, loadingBotSelector, resetConfig, selectOrg, selectUser, useAppSelector } from 'store';
import { ButtonWithMenuItems } from '../../../common/ButtonWithMenuItems/index.ts';
import styles from './BotList.module.scss';
import { BotListProps } from './BotList.types.ts';
import { convertTimestampWithMonthSrt } from 'utils/primitives/date/dateUtils.ts';
import { styled } from '@mui/material';
import { InputSearch } from 'components/common';
import { createMuiTheme } from '@material-ui/core/styles';
import { OverflowTip } from 'components/common';
const StyledTableHead = styled(TableHead)((theme: any) => ({}));
const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      root: {
        padding: '4px 8px',
        backgroundColor: 'red',
      },
    },
  },
});
export const BotList: FC<BotListProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const bots = useSelector(allBotsSelector);
  const [deleteModalIsOpen, setDeleteModalState] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedOrg = useAppSelector(selectOrg);
  const [currentOrgBotsList, setBotsList] = useState<any>();
  useEffect(() => {
    if (selectedOrg) {
      setBotsList(bots.filter((bot) => bot.organizationId === +selectedOrg?.value));
    }
  }, [selectedOrg, bots]);

  const filteredItems = currentOrgBotsList
    ? currentOrgBotsList.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const rows = currentOrgBotsList
    ? [...currentOrgBotsList].sort(
        (a, b) =>
          a.organization.name.toLowerCase().localeCompare(b.organization.name.toLowerCase()) ||
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      )
    : [];

  const displayItems = searchTerm ? filteredItems : rows;
  // const filteredRows = bots.filter((bot) => {
  //   return bot.organization.name.toLowerCase() === selectedOrg?.label.toLowerCase();
  // });
  // // const ownerId = selectedOrg?.subValue;
  // // console.log(bots);
  // const sortedFilteredRows = [...filteredRows].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const user = useSelector(selectUser);
  const botsLoading = useSelector(loadingBotSelector);

  const betaconfigureChangeById = async (id: number) => {
    dispatch(resetConfig());
    navigator(`${NavigationEnum.AI_AGENT_CONFIG}/${id}`);
  };

  const handleClickWidgets = async (id: number) => {
    dispatch(resetConfig());
    navigator(`${NavigationEnum.AI_WIDGET}/${id}`);
  };
  const createBotFromTemplate = async () => {
    navigator(`${NavigationEnum.AI_AGENT_TEMPLATE}`);
  };
  const createBot = async () => {
    navigator(`${NavigationEnum.CREATE_BOT}`);
  };
  const handleClickDeleteBot = (botId: number) => {
    setDeleteModalState(true);
    const currentBot = bots.find((x) => x.id === botId);
    if (currentBot) {
      fetchBotById(currentBot?.id)
        .then((data) => {
          const isOwner = data.data.owner.id === user?.id;
          props.onClickDeleteBot(botId, isOwner, currentBot.name);
        })
        .finally(() => {
          setDeleteModalState(false);
        });
    }
  };
  // const changeLang = (lng: string) => {
  //   i18next.changeLanguage(lng);
  // };

  return (
    <div className={styles.wrapper}>
      {botsLoading ? (
        <Loader type={'full-page'} />
      ) : (
        <>
          {deleteModalIsOpen && <Loader type={'full-page'} />}

          <div className={styles.buttonContainer}>
            {rows.length === 0 ? (
              <div></div>
            ) : (
              <InputSearch
                customClass={styles.input}
                placeholder={'Search'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}

            <ButtonWithMenuItems
              label={t('botList.createBot')}
              menuItems={[
                {
                  label: t('configurationPageFeatures.fromTemplate'),
                  onClick: () => createBotFromTemplate(),
                },
                {
                  label: t('configurationPageFeatures.fromForm'),
                  onClick: () => createBot(),
                },
              ]}
            />
          </div>
          {/* <div>{t('title')}</div>
            <TryItNowButton onClick={() => changeLang('uk')} label={'Chage language'} style={{ height: '48px' }} />
            <TryItNowButton onClick={() => changeLang('en-US')} label={'Chage language'} style={{ height: '48px' }} /> */}
          {/* <TryItNowButton onClick={createBot} label={t('botList.createBot')} style={{ width: '220px' }} /> */}

          {bots.length === 0 ? (
            <EmptyPlaceholder icon={'bot'} text={t('configurationPageFeatures.dontHaveBots')} />
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 'none',
                minWidth: 120,
                width: '100%',
                height: '100%',
              }}>
              <Table
                sx={{ minWidth: 100, boxShadow: 'none' }}
                size="small"
                aria-label="a dense table"
                className={styles.expandTable}
                stickyHeader={true}>
                <StyledTableHead sx={{ boxShadow: 'none' }}>
                  <TableRow sx={{ boxShadow: 'none' }}>
                    <TableCell
                      style={{
                        padding: 0,
                        border: 'none',
                      }}>
                      <div
                        className={styles.headerCell}
                        style={{
                          borderTopLeftRadius: '5px',
                          borderBottomLeftRadius: '5px',
                          borderLeft: '1px solid #EAEEF4',
                        }}>
                        <span className={styles.tableLabel}>{t('botList.name')}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 0,
                        border: 'none',
                      }}>
                      <div className={styles.headerCell}>
                        <span className={styles.tableLabel}>Date Created </span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 0,
                        border: 'none',
                      }}>
                      <div className={styles.headerCell}>
                        <span className={styles.tableLabel}>Modified Date</span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 0,
                        border: 'none',
                      }}>
                      <div className={styles.headerCell}>
                        <span className={styles.tableLabel}>Organization Name</span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 0,
                        border: 'none',
                      }}>
                      <div
                        className={styles.headerCell}
                        style={{
                          borderTopRightRadius: '5px',
                          borderBottomRightRadius: '5px',
                          borderRight: '1px solid #EAEEF4',
                          display: 'flex',
                        }}>
                        <span className={styles.tableLabelActions}>Actions</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody
                  sx={{
                    '& .MuiTableRow-root div': {
                      padding: '7px 14px',
                      marginTop: '10px',
                      marginBottom: '10px',
                      maxHeight: '35px',
                      width: '100%',
                      overflow: 'hidden',
                    },
                    '& .MuiTableRow-root div :last-child': {
                      padding: '0',
                      marginTop: '0',
                      marginBottom: '0',
                      height: '21px',
                      maxHeight: '35px',
                    },
                    [theme.breakpoints.down('md')]: {
                      '& .MuiTableRow-root div': {
                        padding: '6px 7px',
                        marginTop: '5px',
                        marginBottom: '5px',
                        width: '100%',
                        maxWidth: '110px',
                      },
                      '& .MuiTableRow-root div:last-child': {
                        width: '100%',
                        maxWidth: '110px',
                      },
                    },
                  }}>
                  {displayItems.map((row: any) => {
                    return (
                      <TableRow
                        sx={{
                          '&:hover div': {
                            backgroundColor: '#EAEFF7',
                          },
                          [theme.breakpoints.down('md')]: {
                            '&:hover td': {
                              backgroundColor: '#EAEFF7',
                            },
                          },
                        }}
                        key={row.id}
                        className={`${styles.tipicalRow} marker_row_class`}
                        onClick={(e: React.MouseEvent<any>) => {
                          if (
                            //@ts-expect-error: Temp solution
                            e.nativeEvent?.srcElement?.classList?.contains('marker_row_class') ||
                            //@ts-expect-error: Temp solution
                            e.target?.classList?.contains('MuiTableCell-root') ||
                            //@ts-expect-error: Temp solution
                            e.target?.id === 'tableLabel'
                          ) {
                            betaconfigureChangeById(row.id);
                          }
                        }}>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '0px',
                            height: '40px',
                            maxWidth: 306,
                          }}>
                          <div
                            onClick={(e: React.MouseEvent<any>) => {
                              betaconfigureChangeById(row.id);
                            }}
                            style={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }}>
                            <OverflowTip value={row.name}>
                              {
                                <span
                                  onClick={(e: React.MouseEvent<any>) => {
                                    betaconfigureChangeById(row.id);
                                  }}
                                  className={styles.tableLabel}>
                                  {row.name}
                                </span>
                              }
                            </OverflowTip>
                          </div>
                        </TableCell>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '0px',
                            height: '40px',
                            maxWidth: 446,
                          }}>
                          <div
                            onClick={(e: React.MouseEvent<any>) => {
                              betaconfigureChangeById(row.id);
                            }}>
                            <OverflowTip value={convertTimestampWithMonthSrt(row.createdDate)}>
                              {
                                <span
                                  onClick={(e: React.MouseEvent<any>) => {
                                    betaconfigureChangeById(row.id);
                                  }}
                                  id={'tableLabel'}
                                  className={styles.tableLabel}>
                                  {convertTimestampWithMonthSrt(row.createdDate)}{' '}
                                </span>
                              }
                            </OverflowTip>
                          </div>
                        </TableCell>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '0px',
                            height: '40px',
                            maxWidth: 446,
                          }}>
                          <div
                            onClick={(e: React.MouseEvent<any>) => {
                              betaconfigureChangeById(row.id);
                            }}>
                            <OverflowTip value={convertTimestampWithMonthSrt(row.modifiedDate)}>
                              {
                                <span
                                  onClick={(e: React.MouseEvent<any>) => {
                                    betaconfigureChangeById(row.id);
                                  }}
                                  id={'tableLabel'}
                                  className={styles.tableLabel}>
                                  {convertTimestampWithMonthSrt(row.modifiedDate)}
                                </span>
                              }
                            </OverflowTip>
                          </div>
                        </TableCell>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '0px',
                            height: '40px',
                          }}>
                          <div
                            onClick={(e: React.MouseEvent<any>) => {
                              betaconfigureChangeById(row.id);
                            }}>
                            <OverflowTip value={convertTimestampWithMonthSrt(row.modifiedDate)}>
                              {
                                <span
                                  onClick={(e: React.MouseEvent<any>) => {
                                    betaconfigureChangeById(row.id);
                                  }}
                                  id={'tableLabel'}
                                  className={styles.tableLabel}>
                                  {row.organization?.name}
                                </span>
                              }
                            </OverflowTip>
                          </div>
                        </TableCell>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '0px',
                            height: '40px',
                          }}>
                          <div style={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}>
                            <MenuItems
                              menuItems={[
                                {
                                  label: 'Edit',
                                  onClick: () => betaconfigureChangeById(row.id),
                                },
                                {
                                  label: 'Widgets',
                                  onClick: () => handleClickWidgets(row.id),
                                },
                                {
                                  label: t('configurationPageFeatures.delete'),
                                  onClick: () => handleClickDeleteBot(row.id),
                                },
                              ]}></MenuItems>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/* <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              type="submit"
              endIcon={<PlusOne />}
              onClick={createBot}
            >
              Create New Bot
            </Button>
          </div> */}
        </>
      )}
    </div>
  );
};
