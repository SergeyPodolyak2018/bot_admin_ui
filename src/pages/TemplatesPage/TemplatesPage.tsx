import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, ColumnData, FixedHeaderContent, MenuItems } from 'components/common';
import { CreateNewTemplateForm, EditTemplateForm } from 'components/features';
import { ConfirmModal } from 'components/features/common/ConfirmationModal/ConfirmModal.tsx';
import { TApplyCreateBot } from 'components/features/TemplatesPageFeatures/CreateNewTemplateForm/CreateNewTemplate.types.ts';
import { TApplyEditBot } from 'components/features/TemplatesPageFeatures/EditTemplateForm/EditTemplate.types.ts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTemplate, editTemplate, editTemplateActive, removeTemplate } from 'services';
import {
  addNotification,
  fetchBots,
  fetchOrganisations,
  fetchTemplates,
  fetchTemplateTypes,
  loadingBotSelector,
  selectCategories,
  selectOrganisationsLoader,
  selectOrganisationsState,
  selectTemplates,
  selectTemplatesLoader,
  selectTemplateTypesLoader,
  setTemplate,
} from 'store';
import { useAppDispatch, useAppSelector } from 'store/store.hooks.ts';
import logger from 'utils/logger.ts';
import GreenCircleSvg from '../../assets/svg/greenCircle.svg';
import RedCircleSvg from '../../assets/svg/redCircle.svg';
import styles from './templates.module.scss';
import { ITemplate } from './TemplatesPage.types.ts';

const columns: ColumnData[] = [
  {
    width: 100,
    label: 'ID',
    dataKey: 'id',
  },
  {
    width: 100,
    label: 'Template',
    dataKey: 'name',
  },
  {
    width: 150,
    label: 'Category',
    dataKey: 'category',
  },
  {
    width: 150,
    label: 'Status',
    dataKey: 'status',
  },
  {
    width: 150,
    label: 'Description',
    dataKey: 'description',
  },
  {
    width: 50,
    label: '',
    dataKey: 'action',
  },
];

interface IConfirmModalIsOpen {
  isOpen: boolean;
  templateId: number;
  templateName: string;
}

export const TemplatesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const loaderTemplates = useAppSelector(selectTemplatesLoader);
  const loaderTemplateTypes = useAppSelector(selectTemplateTypesLoader);
  const loaderBots = useAppSelector(loadingBotSelector);
  const loaderOrganizations = useAppSelector(selectOrganisationsLoader);

  const templates = useAppSelector(selectTemplates);
  const categories = useAppSelector(selectCategories);
  const organisations = useAppSelector(selectOrganisationsState);
  const [organizationId, setOrganizationId] = useState(0);
  const [isCreateNewTemplate, setIsCreateNewTemplate] = useState(false);
  const [isUpdateTemplateFormOpen, setIsUpdateTemplateFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<null | ITemplate>(null);
  const [modalIsOpen, setModalIsOpen] = useState<IConfirmModalIsOpen>({
    isOpen: false,
    templateId: 0,
    templateName: '',
  });

  useEffect(() => {
    if (!organisations.data.length) dispatch(fetchOrganisations());
  }, []);

  useEffect(() => {
    updateTemplates();
    updateCategories();
    updateBots();
  }, []);

  const updateTemplates = () => {
    dispatch(fetchTemplates());
  };

  const updateCategories = () => {
    dispatch(fetchTemplateTypes());
  };

  const updateBots = () => {
    dispatch(fetchBots());
  };

  const getCategoryName = (id: number): string => {
    const foundCat = categories.find((type_id: any) => type_id.id === id);
    return foundCat?.name || '';
  };

  const updateActiveStatus = async (id: number, status: boolean) => {
    try {
      const res = await editTemplateActive(id, status);
      dispatch(setTemplate({ id: res.data.id, isActive: res.data.isActive }));
      dispatch(
        addNotification({
          message: '',
          type: 'success',
          title: t(res.data.isActive ? 'TemplatePage.activateTemplate' : 'TemplatePage.deactivateTemplate'),
        }),
      );
    } catch (ex: any) {
      logger.debug('Change template status exception', ex);
      dispatch(
        addNotification({
          message: ex.response?.data?.message || '',
          type: 'error',
          title: t(status ? 'TemplatePage.activateTemplate' : 'TemplatePage.deactivateTemplate'),
        }),
      );
    }
  };

  const handleDeleteTemplate = async () => {
    if (!modalIsOpen) return;
    if (!organizationId) return;
    try {
      await removeTemplate(modalIsOpen.templateId, organizationId);
      dispatch(fetchTemplates());
      dispatch(fetchBots());
      setModalIsOpen({ isOpen: false, templateId: 0, templateName: '' });
      setOrganizationId(0);
      dispatch(
        addNotification({
          message: '',
          type: 'success',
          title: t('TemplatePage.deletedTemplateSuccess'),
        }),
      );
    } catch (ex: any) {
      logger.debug('Delete Template Exception', ex);
      dispatch(
        addNotification({
          message: ex.response?.data?.message || '',
          type: 'error',
          title: t('TemplatePage.deletedTemplateFail'),
        }),
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>Templates</div>
        <div className={styles.buttonsHolder}>
          <Button
            onClick={() => {
              setIsCreateNewTemplate(true);
            }}
            style={{ width: '220px' }}
            label="Create New Template"
          />
        </div>
      </div>
      {(loaderBots || loaderTemplates || loaderTemplateTypes || loaderOrganizations) && <h1>Loading.....</h1>}
      {!loaderTemplates &&
        !loaderBots &&
        !loaderTemplateTypes &&
        !loaderOrganizations &&
        categories.length > 0 &&
        templates.length > 0 && (
          <div className={styles.list}>
            <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" size={'small'}>
                  <FixedHeaderContent columns={columns} />
                  <TableBody>
                    {templates.map((template: any, index: any) => (
                      <TableRow key={index} sx={{ border: '1px solid #EAEEF4' }}>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            padding: '12px 24px 12px 24px',
                            border: '1px solid #EAEEF4',
                            borderRight: 'none',
                            borderRadius: '5px',
                          }}
                          component="th"
                          scope="row">
                          {template.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            padding: '12px 24px 12px 24px',
                            border: '1px solid #EAEEF4',
                            borderRight: 'none',
                            borderRadius: '5px',
                          }}
                          component="th"
                          scope="row">
                          {template.bot.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            border: '1px solid #EAEEF4',
                            borderLeft: 'none',
                            borderRight: 'none',
                          }}
                          component="th"
                          scope="row">
                          {getCategoryName(template.typeId)}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            border: '1px solid #EAEEF4',
                            borderLeft: 'none',
                            borderRight: 'none',
                          }}
                          component="th"
                          scope="row">
                          {template.isActive && <img src={GreenCircleSvg} alt={''} />}
                          {!template.isActive && <img src={RedCircleSvg} alt={''} />}
                          <span style={{ marginLeft: '5px' }}>{template.isActive ? 'Active' : 'Inactive'}</span>
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            border: '1px solid #EAEEF4',
                            borderLeft: 'none',
                            borderRight: 'none',
                          }}
                          component="th"
                          scope="row">
                          {template.description}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            border: '1px solid #EAEEF4',
                            borderLeft: 'none',
                          }}
                          component="th"
                          scope="row">
                          <div className={styles.membersHolder}>
                            <MenuItems
                              menuItems={[
                                {
                                  label: template.isActive ? 'Deactivate' : 'Activate',
                                  onClick: () => {
                                    updateActiveStatus(template.id, !template.isActive);
                                  },
                                },
                                {
                                  label: 'Remove',
                                  onClick: () =>
                                    setModalIsOpen({
                                      isOpen: true,
                                      templateId: template.id,
                                      templateName: template.bot.name,
                                    }),
                                },
                                {
                                  label: 'Update',
                                  onClick: () => {
                                    setSelectedTemplate(template);
                                    setIsUpdateTemplateFormOpen(true);
                                  },
                                },
                              ]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        )}
      {modalIsOpen?.isOpen && (
        <ConfirmModal
          disableConfirm={false}
          confirm={handleDeleteTemplate}
          cancel={() => {
            setModalIsOpen({ isOpen: false, templateId: 0, templateName: '' });
            setOrganizationId(0);
          }}
          title="deleteTemplate">
          <p className={styles.confirmModal__content}>To confirm select organization</p>
          <FormControl fullWidth style={{ marginTop: '10px', width: '90%' }}>
            <InputLabel id="demo-simple-select-label">{t('configurationPageFeatures.organizations')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label={t('configurationPageFeatures.organizations')}
              name="organizationId"
              onChange={(v) => {
                setOrganizationId(Number(v.target.value));
              }}>
              {organisations.data.map((el) => (
                <MenuItem value={el.id} key={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ConfirmModal>
      )}
      {isCreateNewTemplate && (
        <CreateNewTemplateForm
          onClose={() => setIsCreateNewTemplate(false)}
          onApply={async ({ botId, typeId, description, isActive }: TApplyCreateBot) => {
            try {
              await createTemplate({ botId, typeId, description, isActive });
              updateTemplates();
              setIsCreateNewTemplate(false);
              dispatch(
                addNotification({
                  message: '',
                  type: 'success',
                  title: t('TemplatePage.createdTemplateSuccess'),
                }),
              );
            } catch (ex: any) {
              logger.debug('Create Template Exception', ex);
              dispatch(
                addNotification({
                  message: ex.response?.data?.message || '',
                  type: 'error',
                  title: t('TemplatePage.createdTemplateFail'),
                }),
              );
            }
          }}
        />
      )}

      {isUpdateTemplateFormOpen && (
        <EditTemplateForm
          template={selectedTemplate as ITemplate}
          onClose={() => setIsUpdateTemplateFormOpen(false)}
          onApply={async ({ id, typeId, description, isActive }: TApplyEditBot) => {
            try {
              await editTemplate({ id, typeId, description, isActive });
              updateTemplates();
              setIsUpdateTemplateFormOpen(false);
              dispatch(
                addNotification({
                  message: '',
                  type: 'success',
                  title: t('TemplatePage.updatedTemplateSuccess'),
                }),
              );
            } catch (ex: any) {
              console.log('Edit Template Exception', ex);
              dispatch(
                addNotification({
                  message: ex.response?.data?.message || '',
                  type: 'error',
                  title: t('TemplatePage.updatedTemplateFail'),
                }),
              );
            }
          }}
        />
      )}
    </div>
  );
};
