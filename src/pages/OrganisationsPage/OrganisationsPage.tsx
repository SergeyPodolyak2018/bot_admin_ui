import { Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import TableHead from '@mui/material/TableHead';

import { ColumnData, EmptyPlaceholder, Loader, MenuItems } from 'components/common';
import { ButtonWithMenuItems } from 'components/common/ButtonWithMenuItems';
import { CreateNewOrgForm, DeleteOrgForm, InviteMemberForm, UpdateOrgForm } from 'components/features';
import { AllMembersTooltipAvatar } from 'components/features/common/AllMembersTooltipAvatar/AllMembersTooltipAvatar.tsx';
import { UserAvatar } from 'components/features/common/UserAvatar/UserAvatar.tsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { postOrganisation, postOrganisationAssignUser, putOrganisation, removeOrganisation } from 'services';
import { addNotification, fetchUser, selectUser, setOrganisations } from 'store';
import { selectOrganisations, selectOrganisationsLoader } from 'store/organisations/organisations.selectors.ts';
import { fetchOrganisations } from 'store/organisations/organisations.thunks.ts';
import { useAppDispatch, useAppSelector } from 'store/store.hooks.ts';
import { TOrganisation, TOrgOwner } from 'types';
import logger from 'utils/logger.ts';
import styles from './organisation.module.scss';
import { validateEmails } from './utils.ts';

const columns: ColumnData[] = [
  {
    width: 100,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 100,
    label: 'Owner',
    dataKey: 'owner',
  },
  {
    width: 150,
    label: 'Members',
    dataKey: 'members',
  },
  {
    width: 50,
    label: '',
    dataKey: 'action',
  },
];

interface IConfirmModalIsOpen {
  isOpen: boolean;
  owner: TOrgOwner | null;
  botCount: number;
  orgName: string;
  organizationId: number;
}

const StyledTableHead = styled(TableHead)(({ theme }) => ({}));

export const OrganisationsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const organisations = useAppSelector(selectOrganisations);

  const loader = useAppSelector(selectOrganisationsLoader);
  const user = useAppSelector(selectUser);

  // const [organisations, setOrganisations] = useState<TOrganisation[]>();
  const [isCreateNewOrgFormOpen, setIsCreateNewOrgFormOpen] = useState(false);
  const [isUpdateOrgFormOpen, setIsUpdateOrgFormOpen] = useState(false);
  const [isInviteMemberFormOpen, setIsInviteMemberFormOpen] = useState(false);
  const [orgForInvite, setOrgForINvite] = useState(-1);
  const [orgForUpdate, setOrgForUpdate] = useState(-1);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState<IConfirmModalIsOpen>({
    orgName: '',
    botCount: 0,
    owner: null,
    isOpen: false,
    organizationId: 0,
  });
  const [, setOrgId] = useState(0);
  const [userAlreadyExist, setUserAlreadyExist] = useState(false);
  const [currentUserIsOwner, setOwner] = useState(false);
  const [orgName, setOrgName] = useState('');
  useEffect(() => {
    updateOrganisations();
  }, []);

  // useEffect(() => {
  //   getOrganisationById(organizationId).then((response: any) => {
  //     setOwner(response.data.owner.id === user?.id);
  //   });
  // }, [modalIsOpen, isUpdateOrgFormOpen]);

  const updateOrganisations = () => {
    dispatch(fetchOrganisations());
  };

  const getOrgName = (id: number): string => {
    const foundOrg = organisations.find((org) => org.id === id);
    return foundOrg?.name || '';
  };

  const inviteUsers = async (email: string) => {
    try {
      if (!validateEmails(email)) {
        setError('Each email should be valid');
        return;
      }
      const emails = email.split(',').map((e) => e.trim());
      const foundOrg = organisations.find((org) => org.id === orgForInvite);
      const isUserFound = foundOrg?.users.some((user) => emails.includes(user.email));
      if (isUserFound) {
        setUserAlreadyExist(true);
        return;
      }
      await postOrganisationAssignUser(orgForInvite, { emails })
        .then((data: any) => {
          setIsInviteMemberFormOpen(false);
          dispatch(fetchUser());
          dispatch(fetchOrganisations());
          if (data.data?.emailsNotFound) {
            dispatch(
              addNotification({
                message: `User with email ${data.data?.emailsNotFound[0]} not found`,
                type: 'error',
                title: 'Error',
              }),
            );
          } else {
            dispatch(addNotification({ message: 'Assign user success', type: 'success', title: 'Success' }));
          }
        })
        .catch((err) => {
          let message = err?.response?.data?.message ? err.response.data.message : 'Error with assign user';
          message = Array.isArray(message) ? message.join(',') : message;

          setError(message);
          dispatch(addNotification({ message, type: 'error', title: 'Error' }));
        });
    } catch (error) {
      logger.error('ERR:', error);
      /* empty */
    }
  };

  const handleDeleteOrganization = () => {
    if (!modalIsOpen) return;
    if (modalIsOpen.owner?.id === user?.id) {
      removeOrganisation(modalIsOpen.organizationId).then(() => {
        dispatch(fetchOrganisations());
        dispatch(addNotification({ type: 'success', title: 'Delete Successfully', message: '' }));
      });

      setOrgName('');
    } else {
      setModalIsOpen({ isOpen: false, organizationId: 0, owner: null, botCount: 0, orgName: '' });
      setOrgName('');
      dispatch(
        addNotification({
          message: 'Only the owner has permission to remove the organization',
          type: 'error',
          title: 'Organization',
        }),
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.buttonContainer}>
          {/* <InputSearch style={{ width: '324px' }} placeholder={'Search'} value={''} onChange={() => {}} /> */}
          <ButtonWithMenuItems
            style={{ marginLeft: 'auto' }}
            label={t('organisationsPage.createNewOrgaization')}
            menuItems={[]}
            withoutMenu={true}
            onClick={() => {
              setIsCreateNewOrgFormOpen(true);
            }}
          />
        </div>
        {/* <div className={styles.buttonsHolder}>
          <Button
            onClick={() => {
              setIsCreateNewOrgFormOpen(true);
            }}
            style={{ width: '220px', padding: '5px 10px' }}
            label="Create New Organization"
          />
        </div> */}
      </div>
      {loader ? (
        <Loader type={'full-page'} />
      ) : (
        <>
          {!loader && organisations?.length === 0 ? (
            <EmptyPlaceholder icon={'shield'} text={`You don't have any organization.`} />
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
                sx={{ minWidth: 650, boxShadow: 'none' }}
                aria-label="simple table"
                className={styles.expandTable}
                stickyHeader={true}>
                <StyledTableHead sx={{ boxShadow: 'none' }}>
                  <TableRow sx={{ boxShadow: 'none' }}>
                    <TableCell
                      style={{
                        width: 352,
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
                        <span className={styles.tableLabel}>Organization Name</span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        width: 352,
                        padding: 0,
                        border: 'none',
                      }}>
                      <div className={styles.headerCell}>
                        <span className={styles.tableLabel}>Owner</span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        width: 352,
                        padding: 0,
                        border: 'none',
                      }}>
                      <div className={styles.headerCell}>
                        <span className={styles.tableLabel}>Members</span>
                      </div>
                    </TableCell>
                    {/* <TableCell
                      style={{
                        width: 352,
                        padding: 0,
                        border: 'none',
                      }}>
                      <div className={styles.headerCell}>
                        <span className={styles.tableLabel}>Date Created</span>
                      </div>
                    </TableCell> */}
                    <TableCell
                      style={{
                        width: '54px',
                        padding: 0,
                        border: 'none',
                      }}>
                      <div
                        className={styles.headerCell}
                        style={{
                          borderTopRightRadius: '5px',
                          borderBottomRightRadius: '5px',
                          borderRight: '1px solid #EAEEF4',
                        }}>
                        <span className={styles.tableLabel}>Actions</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody
                  sx={{
                    '& .MuiTableRow-root:hover td:first-child': {
                      borderTopLeftRadius: '5px',
                      borderBottomLeftRadius: '5px',
                    },
                    '& .MuiTableRow-root:hover td:last-child': {
                      borderTopRightRadius: '5px',
                      borderBottomRightRadius: '5px',
                    },

                    '& .MuiTableRow-root': {
                      border: '1px solid black !important',
                    },

                    '& .MuiTableRow-root:last-child td': {
                      border: 'none',
                    },

                    '& .MuiTableRow-root:last-child td:first-child': {
                      borderLeft: 'none',
                    },
                    '& .MuiTableRow-root:last-child td:last-child': {
                      borderRight: 'none',
                    },
                  }}>
                  {organisations?.map((org: TOrganisation, index: any) => {
                    return (
                      <TableRow
                        key={org.id}
                        sx={{
                          padding: '4px 0px 4px 0px',
                        }}
                        className={`${styles.tipicalRow} marker_row_class`}>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '14px',
                            height: '40px',
                          }}>
                          <span
                            className={styles.tableLabel}
                            style={{ fontWeight: user?.id === org.owner.id ? 'bold' : 'normal' }}>
                            {org.name}{' '}
                          </span>
                        </TableCell>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '14px',
                            height: '40px',
                          }}>
                          <span className={styles.tableLabel}>{org.owner.email}</span>
                        </TableCell>
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '14px',
                            height: '40px',
                          }}>
                          <div className={`${styles.membersHolder}`}>
                            {org.users?.slice(0, 5).map((user, index) => (
                              <UserAvatar key={index} email={user.email} styles={styles.avatar} />
                            ))}
                            {org.users?.length > 5 && (
                              <AllMembersTooltipAvatar users={org.users.slice(5)} styles={styles.avatar} />
                            )}
                          </div>
                        </TableCell>
                        {/* <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '14px',
                            height: '40px',
                          }}>
                          <span className={styles.tableLabel}></span>
                        </TableCell> */}
                        <TableCell
                          //onClick={() => handleChange(row.id)}
                          style={{
                            padding: '14px',
                            height: '40px',
                            width: '',
                          }}>
                          <div style={{ width: '30px', marginLeft: '11px' }}>
                            <MenuItems
                              style={{ width: '54px' }}
                              menuItems={[
                                {
                                  label: 'Invite',
                                  onClick: () => {
                                    setIsInviteMemberFormOpen(true);
                                    setOrgForINvite(org.id);
                                    setUserAlreadyExist(false);
                                    setOwner(org.owner.id === user?.id);
                                  },
                                },
                                {
                                  label: 'Rename',
                                  onClick: () => {
                                    setOrgId(org.id);
                                    setIsUpdateOrgFormOpen(true);
                                    setOrgForUpdate(org.id);
                                    setOwner(org.owner.id === user?.id);
                                  },
                                },
                                {
                                  label: 'Remove',
                                  onClick: () =>
                                    setModalIsOpen({
                                      isOpen: true,
                                      organizationId: org.id,
                                      owner: org.owner,
                                      botCount: org.botCount,
                                      orgName: org.name,
                                    }),
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
        </>
      )}

      {modalIsOpen?.isOpen && (
        <DeleteOrgForm
          onClose={() => {
            setModalIsOpen({ isOpen: false, organizationId: 0, owner: null, botCount: 0, orgName: '' });
            setOrgName('');
          }}
          onApply={handleDeleteOrganization}
          orgName={modalIsOpen.orgName}
          botCount={modalIsOpen.botCount}
        />
      )}
      {isCreateNewOrgFormOpen && (
        <CreateNewOrgForm
          onClose={() => setIsCreateNewOrgFormOpen(false)}
          onApply={(orgName: string) => {
            postOrganisation({ name: orgName }).then((data: any) => {
              dispatch(fetchUser());
              updateOrganisations();
              setOrganisations([data.data]);
              setIsInviteMemberFormOpen(false);
              dispatch(addNotification({ type: 'success', title: 'Create Successfully', message: '' }));
            });
          }}
        />
      )}
      {isUpdateOrgFormOpen && (
        <UpdateOrgForm
          name={getOrgName(orgForUpdate)}
          onClose={() => setIsUpdateOrgFormOpen(false)}
          onApply={(orgName: string) => {
            if (currentUserIsOwner) {
              putOrganisation({ name: orgName }, orgForUpdate).then((data: any) => {
                updateOrganisations();
                setOrganisations([data.data]);
                setIsUpdateOrgFormOpen(false);
                dispatch(addNotification({ type: 'success', title: 'Update Successfully', message: '' }));
              });
            } else {
              dispatch(
                addNotification({
                  message: 'Only the owner has permission to change organization name',
                  type: 'error',
                  title: 'Organization',
                }),
              );
              setIsUpdateOrgFormOpen(false);
            }
          }}
        />
      )}

      {isInviteMemberFormOpen && (
        <InviteMemberForm
          onChange={() => setUserAlreadyExist(false)}
          error={error}
          onClose={() => setIsInviteMemberFormOpen(false)}
          onApply={inviteUsers}
          existingUser={userAlreadyExist}
        />
      )}
      {/* <div className={styles.infoHolder}>
        {cards.map((card: ICardData) => (
          <div className={styles.infoCard}>
            <span className={styles.memberLabel}>{card.membersCount}</span>
            <div className={styles.cardContent}>
              <div className={styles.typeLabelHolder}>
                <span className={styles.typeLabel}>{card.label}</span>
              </div>
              <div className={styles.memberIconsHolder}>
                {card.members.map((name: string) => (
                  <Avatar name={name} size="50" round={true} style={{ marginLeft: '-25px' }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.filterHolder}>
        <input placeholder="Enter a name or email address"></input>
        <Dropdown
          styles={{ width: '122px', height: '34px' }}
          options={[
            { label: '1', value: '1' },
            { label: '1', value: '1' },
            { label: '1', value: '1' },
            { label: '1', value: '1' },
          ]}
          selectedOption={{ label: 'All', value: 'All' }}
          onSelect={(selectedOption: IOption) => {
            console.log(selectedOption);
          }}
        />
        <Dropdown
          styles={{ width: '122px', height: '34px' }}
          options={[
            { label: '1', value: '1' },
            { label: '1', value: '1' },
            { label: '1', value: '1' },
            { label: '1', value: '1' },
          ]}
          selectedOption={{ label: 'Active', value: 'Active' }}
          onSelect={(selectedOption: IOption) => {
            console.log(selectedOption);
          }}
        />
      </div> */}
    </div>
  );
};
