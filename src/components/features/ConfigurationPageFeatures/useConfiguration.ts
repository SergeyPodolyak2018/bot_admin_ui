import { NavigationEnum } from 'navigation';
import { Dispatch, DragEvent, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
} from 'reactflow';

import {
  categoriesBotSelector,
  fetchConfig,
  fetchOrganisations,
  getchatBotWidgetHidden,
  getchatBotWidgetVisible,
  getConfig,
  getShowEditWindowSelector,
  resetConfig,
  setActiveBot,
  setChatBotWidgetHidden,
  setChatBotWidgetVisible,
  setShowEditWindow,
  useAppDispatch,
  useAppSelector,
  connectCategoryToFile,
  connectCategoryToPrompt
} from 'store';
import { getEdgesFromConfig, getNodesFromConfig } from 'utils/botUtils.ts';
import { initialEdges, initialNodes } from './constants';
import { TActiveFormType, TPosition, TTypeNode } from './types';

export type UseConfigurationArgs = {
  botId: string | number | undefined;
};
export type UseConfigurationData = {
  showEditWindow: boolean;
  reactFlowWrapper: any; // Assuming a ref to a div
  reactFlowInstance: any;
  setReactFlowInstance: Dispatch<SetStateAction<any>>;
  categories: any[]; // Assuming an array, replace with the actual type
  activeForm: TActiveFormType;
  setActiveForm: Dispatch<SetStateAction<TActiveFormType>>;
  setTempPosition: Dispatch<SetStateAction<TPosition | null>>;
  tempPosition: TPosition | null;
  nodes: Node[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  closeForm: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  config: any; // Replace with the actual configuration type
  isChatBotWidgetVisible: boolean;
  isChatBotWidgetHidden: boolean;
  setIsChatBotWidgetVisible: (value: boolean) => void;
  setIsChatBotWidgetHidden: (value: boolean) => void;
  onConnect: OnConnect;
  isLoading: boolean;
  mainChange: () => void;
  changesExist: boolean;
  isAccessDenied: boolean;
};
export const useConfiguration = ({ botId }: UseConfigurationArgs): UseConfigurationData => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const showEditWindow = useAppSelector(getShowEditWindowSelector);
  const categories = useAppSelector(categoriesBotSelector);
  const config = useAppSelector(getConfig);

  const [activeForm, setActiveForm] = useState<TActiveFormType>({
    type: 'file',
    active: false,
  });

  const isChatBotWidgetVisible = useAppSelector(getchatBotWidgetVisible);
  const isChatBotWidgetHidden = useAppSelector(getchatBotWidgetHidden);
  const [tempPosition, setTempPosition] = useState<TPosition | null>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [isLoading, setIsLoading] = useState(true);
  const [changesExist, setChangesExist] = useState(false);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  const reactFlowWrapper = useRef(null);

  const setIsChatBotWidgetVisible = (value: boolean) => {
    return void dispatch(setChatBotWidgetVisible(value));
  };
  const setIsChatBotWidgetHidden = (value: boolean) => {
    return void dispatch(setChatBotWidgetHidden(value));
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges],
  );
  const mainChange = useCallback(() => {
    setChangesExist(true);
  }, []);

  const closeForm = () => {
    setActiveForm({
      type: 'file',
      active: false,
    });
  };

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => {

        const sourceId = Number(connection.source?.split('_')[1]);
        const sourceType = connection.source?.split('_')[0] === 'file'?'file':'prompt';
        const targetId = Number(connection.target?.split('_')[1]);


        if(!isNaN(sourceId) && !isNaN(targetId)){
          if(sourceType === 'file'){
          dispatch(connectCategoryToFile({categoryId: targetId, fileId:sourceId}))
          }else{
            dispatch(connectCategoryToPrompt({categoryId: targetId, promptId:sourceId}))
          }
        }
        return addEdge(connection, eds);
      });
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }
      if (!reactFlowInstance || typeof reactFlowInstance?.screenToFlowPosition !== 'function') {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setTempPosition({
        ...position,
        type,
        id: undefined,
      });
      setActiveForm({
        type: type as TTypeNode,
        active: true,
      });
      setIsChatBotWidgetVisible(false);
      dispatch(setShowEditWindow(false));
    },

    [reactFlowInstance],
  );

  useEffect(() => {
    if (!botId) return;
    dispatch(resetConfig());
    dispatch(fetchOrganisations()).then(() => {
      dispatch(fetchConfig(botId))
        .then((r) => {
          if ('error' in r) {
            if (r.error!.message!.includes('code 404')) {
              navigate(NavigationEnum.AI_AGENT);
            } else if (r.error!.message!.includes('code 403')) {
              setIsAccessDenied(true);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      dispatch(setActiveBot(botId));
      dispatch(setShowEditWindow(false));
    });
  }, [botId]);

  useEffect(() => {
    if (!config.bot) return;
    setNodes(getNodesFromConfig(config));
    setEdges(getEdgesFromConfig(config));
  }, [config]);

  return {
    showEditWindow,
    reactFlowWrapper,
    categories,
    activeForm,
    setActiveForm,
    tempPosition,
    setTempPosition,
    nodes,
    setNodes,
    edges,
    setEdges,
    reactFlowInstance,
    setReactFlowInstance,
    onNodesChange,
    onEdgesChange,
    closeForm,
    onDragOver,
    onDrop,
    config,
    isChatBotWidgetVisible,
    isChatBotWidgetHidden,
    setIsChatBotWidgetVisible,
    setIsChatBotWidgetHidden,
    onConnect,
    isLoading,
    mainChange,
    changesExist,
    isAccessDenied,
  };
};
