import { ConfirmModalUniversal } from 'components/features/common';
import { FC } from 'react';
import { DragEvent } from 'react';
// eslint-disable-next-line import/no-named-as-default
import ReactFlow from 'reactflow';
import { deleteCategore, deleteFiles, deletePromptById } from 'services/api';
import {
  addNotification,
  fetchConfig,
  getEditTargetSelector,
  getShowDeleteWindowSelector,
  markAsDeletedIndependentCategory,
  markAsDeletedIndependentFile,
  markAsDeletedIndependentPrompt,
  setShowConfirmDeleteWindow,
  useAppDispatch,
  useAppSelector,
} from 'store';
import logger from 'utils/logger.ts';
import { defaultEdgeOptions, defaultViewport, edgeTypes, fitViewOptions, nodeTypes } from '../constants/index.ts';
import { CategoryForm, FileForm, PromtForm } from '../forms/index.ts';
import { EditNode } from '../index.ts';
import styles from './Schema.module.scss';
import { SchemaProps } from './Schema.types.ts';
import { ButtonIcon } from 'components/common/ButtonIcon/ButtonIcon.tsx';
import { useTranslation } from 'react-i18next';

export const Schema: FC<SchemaProps> = ({ confHookData, botId, data, loading, idSaver }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const confirmWindow = useAppSelector(getShowDeleteWindowSelector);
  const target = useAppSelector(getEditTargetSelector);

  const {
    showEditWindow,
    reactFlowWrapper,
    activeForm,
    tempPosition,
    nodes,
    setNodes,
    edges,
    setReactFlowInstance,
    onNodesChange,
    onEdgesChange,
    closeForm,
    onDragOver,
    onDrop,
    isChatBotWidgetVisible,
    mainChange,
    onConnect,
  } = confHookData;

  const deleteAction = async () => {
    if (!botId) return;
    // try {
    if (target.type === 'category') {
      dispatch(markAsDeletedIndependentCategory({ id: target.id }));
      //await deleteCategore(target.id);
    }
    if (target.type === 'file') {
      dispatch(markAsDeletedIndependentFile({ id: target.id }));
      // await deleteFiles(target.id);
    }
    if (target.type === 'promt') {
      dispatch(markAsDeletedIndependentPrompt({ id: target.id }));
      //await deletePromptById(target.id);
    }
    //dispatch(fetchConfig(botId));
    // } catch (err) {
    //   logger.error(err);
    //   dispatch(
    //     addNotification({
    //       message: "Can't delete",
    //       type: 'error',
    //       title: 'Delete',
    //     }),
    //   );
    // }
  };
  const cancellDelete = () => {
    dispatch(setShowConfirmDeleteWindow(false));
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={styles.container}>
      {confirmWindow && (
        <ConfirmModalUniversal
          disableConfirm={false}
          confirm={deleteAction}
          cancel={cancellDelete}
          title={`Delete ${target.type} id ${target.id}?`}></ConfirmModalUniversal>
      )}
      <>
        <div className={styles.dndItems}>
          <>
            <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'file')} draggable>
              <ButtonIcon
                label={t('configurationPageFeatures.file')}
                style={{ height: '100%', width: '100%' }}
                icon="/dragable.svg"
              />
            </div>
            <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'promt')} draggable>
              <ButtonIcon
                label={t('configurationPageFeatures.prompt')}
                style={{ height: '100%', width: '100%' }}
                icon="/dragable.svg"
              />
            </div>
            <div className={styles.dndnode} onDragStart={(event) => onDragStart(event, 'category')} draggable>
              <ButtonIcon
                label={t('configurationPageFeatures.category')}
                style={{ height: '100%', width: '100%' }}
                icon="/dragable.svg"
              />
            </div>
          </>
        </div>
        {showEditWindow && !isChatBotWidgetVisible && <EditNode />}
        {activeForm.type === 'file' && activeForm.active && !isChatBotWidgetVisible && (
          <FileForm close={closeForm} createNode={setNodes} data={tempPosition!} idSaver={idSaver} />
        )}
        {activeForm.type === 'category' && activeForm.active && !isChatBotWidgetVisible && (
          <CategoryForm close={closeForm} createNode={setNodes} data={tempPosition!} idSaver={idSaver} />
        )}
        {activeForm.type === 'promt' && activeForm.active && !isChatBotWidgetVisible && (
          <PromtForm close={closeForm} createNode={setNodes} data={tempPosition!} idSaver={idSaver} />
        )}
        <div className={styles.reactflowWrapper} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectEnd={() => {
              mainChange();
            }}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            defaultViewport={defaultViewport}
            onNodeDragStop={() => {
              mainChange();
            }}
          />
        </div>
      </>
    </div>
  );
};
