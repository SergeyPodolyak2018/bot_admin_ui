import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import classnames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BaseEdge, EdgeProps, getBezierPath, Handle, Node, NodeProps, Position } from 'reactflow';
import {
  getchatBotWidgetVisible,
  setEditTarget,
  setShowConfirmDeleteWindow,
  setShowEditWindow,
  useAppSelector,
} from 'store';
import { TTypeNode } from '../../../../types';
import styles from './SideBar.module.scss';

type TNodeData = {
  value: number;
  label: string;
};
type TNodeDataCat = {
  id: number;
  preprocessor: string;
  splitterType: string;
  threshold: number;
};
const cx = classnames.bind(styles); // <-- explicitly bind your styles

export type TCustomNode = Node<TNodeData>;

export const CustomNodeFile = ({ data, selected }: NodeProps<TNodeData>) => {
  const { t } = useTranslation();
  const isChatBotWidgetVisible = useAppSelector(getchatBotWidgetVisible);
  const dispatch = useDispatch();
  //const dispatch = useDispatch();
  // const editNode = (id: number, type: TTypeNode) => {
  //   dispatch(setEditTarget({ id, type, action: 'update' }));
  //   dispatch(setShowEditWindow(true));
  // };
  const deleteNode = (id: number, type: TTypeNode) => {
    dispatch(setEditTarget({ id, type, action: 'delete' }));
    dispatch(setShowConfirmDeleteWindow(true));
  };

  const className = cx({
    [styles.tipicalNode]: true,
    [styles.active]: selected,
    [styles.file]: true,
  });
  return (
    <div className={className}>
      {/* <div
        className={styles.editWrapper}
        onClick={() => editNode(data.value, 'file')}
      >
        <EditIcon />
      </div> */}
      <div className={styles.header}>
        {t('configurationPageFeatures.file')}
        <Handle type="source" position={Position.Right} />
        {!isChatBotWidgetVisible && (
          <>
            <div className={styles.editWrapper} onClick={() => deleteNode(data.value, 'file')}>
              <DeleteIcon />
            </div>
          </>
        )}
      </div>
      <div className={styles.body}>
        <span>
          {t('configurationPageFeatures.fileName')}:{data.label}
        </span>
      </div>
    </div>
  );
};

export const CustomNodeCategory = ({ data, selected }: NodeProps<TNodeData & TNodeDataCat>) => {
  const isChatBotWidgetVisible = useAppSelector(getchatBotWidgetVisible);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const editNode = (id: number, type: TTypeNode) => {
    dispatch(setEditTarget({ id, type, action: 'update' }));
    dispatch(setShowEditWindow(true));
  };
  const deleteNode = (id: number, type: TTypeNode) => {
    dispatch(setEditTarget({ id, type, action: 'delete' }));
    dispatch(setShowConfirmDeleteWindow(true));
  };
  const className = cx({
    [styles.tipicalNode]: true,
    [styles.active]: selected,
    [styles.category]: true,
  });
  return (
    <div className={className} onDoubleClick={() => editNode(data.value, 'category')}>
      <div className={styles.header}>
        {t('configurationPageFeatures.category')} {data.id}
        <Handle type="target" position={Position.Left} />
        {!isChatBotWidgetVisible && (
          <>
            <div className={styles.editWrapper} onClick={() => editNode(data.value, 'category')}>
              <EditIcon />
            </div>
            <div className={styles.deleteWrapper} onClick={() => deleteNode(data.value, 'category')}>
              <DeleteIcon />
            </div>
          </>
        )}
      </div>
      <div className={styles.body}>
        <span>
          {t('botList.fieldName')}: {data.label}
        </span>
        <span>Preprocessor:{data.preprocessor}</span>
        <span>Spliter:{data.splitterType}</span>
        <span>Threshold:{data.threshold}</span>
      </div>
    </div>
  );
};
export const CustomNodePromt = ({ data, selected }: NodeProps<TNodeData>) => {
  const isChatBotWidgetVisible = useAppSelector(getchatBotWidgetVisible);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const editNode = (id: number, type: TTypeNode) => {
    dispatch(setEditTarget({ id, type, action: 'update' }));
    dispatch(setShowEditWindow(true));
  };
  const deleteNode = (id: number, type: TTypeNode) => {
    dispatch(setEditTarget({ id, type, action: 'delete' }));
    dispatch(setShowConfirmDeleteWindow(true));
  };
  const className = cx({
    [styles.tipicalNode]: true,
    [styles.active]: selected,
    [styles.promt]: true,
  });
  return (
    <div className={className} onDoubleClick={() => editNode(data.value, 'promt')}>
      <div className={styles.header}>
        {t('configurationPageFeatures.prompt')} {data.value}
        <Handle type="source" position={Position.Right} />
        {!isChatBotWidgetVisible && (
          <>
            <div className={styles.editWrapper} onClick={() => editNode(data.value, 'promt')}>
              <EditIcon />
            </div>
            <div className={styles.deleteWrapper} onClick={() => deleteNode(data.value, 'promt')}>
              <DeleteIcon />
            </div>
          </>
        )}
      </div>
      <div className={styles.body}>
        <span>
          {t('botList.fieldName')}: {data.label}
        </span>
      </div>
    </div>
  );
};

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  style,
  markerEnd,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ ...style, stroke: selected ? 'red' : style?.stroke }}
        markerEnd={markerEnd}
      />
    </>
  );
};
