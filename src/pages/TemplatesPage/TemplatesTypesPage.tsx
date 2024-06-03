import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import { Button, ColumnData, FixedHeaderContent, MenuItems } from 'components/common';
import { CreateTemplateCategoryForm, EditTemplateCategoryForm } from 'components/features';
import { ConfirmModal } from 'components/features/common/ConfirmationModal/ConfirmModal.tsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addNotification, fetchTemplateTypes, selectCategories, selectTemplateTypesLoader } from 'store';
import { useAppDispatch, useAppSelector } from 'store/store.hooks.ts';
import logger from 'utils/logger.ts';
import { createTemplateCategory, deleteTemplateCategory, updateTemplateCategory } from '../../services/api/index.ts';
import styles from './templates.module.scss';
import { ITemplateCategory } from './TemplatesPage.types.ts';

const columns: ColumnData[] = [
  {
    width: 100,
    label: 'ID',
    dataKey: 'id',
  },
  {
    width: 100,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 150,
    label: 'Description',
    dataKey: 'description',
  },
  {
    width: 150,
    label: 'Image',
    dataKey: 'image',
  },
  {
    width: 150,
    label: 'Count',
    dataKey: 'templateCount',
  },
  {
    width: 50,
    label: '',
    dataKey: 'action',
  },
];

interface IConfirmModalIsOpen {
  isOpen: boolean;
  id: number;
}

export const TemplatesTypesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const loader = useAppSelector(selectTemplateTypesLoader);
  const categories = useAppSelector(selectCategories);
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const [isUpdateCategory, setIsUpdateCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | ITemplateCategory>(null);
  const [modalIsOpen, setModalIsOpen] = useState<IConfirmModalIsOpen>({
    isOpen: false,
    id: 0,
  });

  useEffect(() => {
    updateCategories();
  }, []);

  const updateCategories = () => {
    dispatch(fetchTemplateTypes());
  };

  const handleDeleteType = async () => {
    if (!modalIsOpen) return;
    try {
      await deleteTemplateCategory(modalIsOpen.id);
      dispatch(fetchTemplateTypes());
      setModalIsOpen({ isOpen: false, id: 0 });
      dispatch(
        addNotification({
          message: '',
          type: 'success',
          title: t('TemplatePage.deletedTemplateTypeSuccess'),
        }),
      );
    } catch (ex: any) {
      logger.debug('Delete Template Type Exception', ex);
      dispatch(
        addNotification({
          message: ex.response?.data?.message || '',
          type: 'error',
          title: t('TemplatePage.deletedTemplateTypeFail'),
        }),
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>Template Types</div>
        <div className={styles.buttonsHolder}>
          <Button
            onClick={() => {
              setIsCreateCategory(true);
            }}
            style={{ width: '220px' }}
            label="Create New Type"
          />
        </div>
      </div>
      {!loader && categories.length === 0 && (
        <div className={styles.placeHolderContainer}>
          <span className={styles.placeHolder}>You don&apos;t have any categories</span>
        </div>
      )}
      {loader && <h1>Loading.....</h1>}
      {!loader && categories.length && (
        <div className={styles.list}>
          <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table" size={'small'}>
                <FixedHeaderContent columns={columns} />
                <TableBody>
                  {categories.map((cat: any, index: any) => (
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
                        {cat.id}
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
                        {cat.name}
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
                        {cat.description}
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
                        <img
                          src={`data:image/png;base64,${cat.image}`}
                          alt={''}
                          style={{ width: '100px', height: '60px' }}
                        />
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
                        {cat.templateCount}
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
                                label: 'Remove',
                                onClick: () =>
                                  setModalIsOpen({
                                    isOpen: true,
                                    id: cat.id,
                                  }),
                              },
                              {
                                label: 'Update',
                                onClick: () => {
                                  setSelectedCategory(cat);
                                  setIsUpdateCategory(true);
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
          confirm={handleDeleteType}
          cancel={() => {
            setModalIsOpen({ isOpen: false, id: 0 });
          }}
          title="deleteTemplateType"></ConfirmModal>
      )}
      {isCreateCategory && (
        <CreateTemplateCategoryForm
          onClose={() => setIsCreateCategory(false)}
          onApply={async (data: Partial<FormData>) => {
            try {
              await createTemplateCategory(data);
              updateCategories();
              setIsCreateCategory(false);
              addNotification({
                message: '',
                type: 'success',
                title: t('TemplatePage.createdTemplateTypeSuccess'),
              });
            } catch (ex: any) {
              logger.debug('Create Template Type Exception', ex);
              addNotification({
                message: ex.response?.data?.message || '',
                type: 'error',
                title: t('TemplatePage.createdTemplateTypeFail'),
              });
            }
          }}
        />
      )}
      {isUpdateCategory && (
        <EditTemplateCategoryForm
          templateType={selectedCategory as ITemplateCategory}
          onClose={() => setIsUpdateCategory(false)}
          onApply={async (id: number, data: Partial<FormData>) => {
            try {
              await updateTemplateCategory({ id, data });
              updateCategories();
              setIsUpdateCategory(false);
              addNotification({
                message: '',
                type: 'success',
                title: t('TemplatePage.updatedTemplateTypeSuccess'),
              });
            } catch (ex: any) {
              logger.debug('Edit Template Category Exception', ex);
              addNotification({
                message: ex.response?.data?.message || '',
                type: 'error',
                title: t('TemplatePage.updatedTemplateTypeFail'),
              });
            }
          }}
        />
      )}
    </div>
  );
};
