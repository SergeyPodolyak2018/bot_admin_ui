import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import { CellEditingStoppedEvent } from 'ag-grid-community';
//import { IHeaderParams } from '@ag-grid-community/core'
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import { MenuItems } from 'components/common';
import { ConfirmModalUniversal } from 'components/features';
import { useEffect, useMemo, useState, useRef } from 'react';
import useStateRef from 'react-usestateref';
import { useTranslation } from 'react-i18next';
import { makeSplitterConfig } from 'utils/template';
import { ISplitterConfig } from '..';
import styles from './table.module.scss';

interface IKnowledgeBaseTable {
  tableData: any[];
  gridRef: React.MutableRefObject<undefined>;
  setUpdated: () => void;
  spliter: ISplitterConfig;

  updateSpliter: (spliter: string) => void;
  originalSpliter: string;
  activeCategoryId: number;
  loading: boolean;
}

export interface ICustomHeaderParams {
  name: string;
  splitterConfig: ISplitterConfig;
  updateIterator: (val: string) => void;
  updateTemplate: (val: string) => void;
  updateOutput: (val: string) => void;
  addColumnAfter: (name: string) => void;
  renameColumn: (oldName: string, newName: string) => void;
  deleteColumn: (name: string) => void;
}

export const CustomHeader = (props: ICustomHeaderParams) => {
  const [rename, setRename] = useState(false);
  const { t } = useTranslation();
  const [name, setName] = useState(props.name);
  const changeName = () => {
    setRename(false);
    props.renameColumn(props.name, name);
  };

  return (
    <div className={styles.mainContainer}>
      {rename ? (
        <span className={styles.editInputStyles}>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            //eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            // onBlur={() => {
            //   setRename(false);
            // }}
          />
          <IconButton onClick={changeName}>
            <SaveIcon fontSize="small" />
          </IconButton>
        </span>
      ) : (
        <div className={styles.nameHolder}>{props.name}</div>
      )}

      <span className={styles.deleteHolder}>
        <MenuItems
          notDefaultMenu={true}
          menuItems={[
            {
              label: 'Edit',
              onClick: () => setRename(true),
            },
            {
              label: 'Delete',
              onClick: () => props.deleteColumn(props.name),
            },
            {
              label: 'Add right',
              onClick: () => props.addColumnAfter(props.name),
            },
            {
              label: 'Primary Key',
              onClick: () => {
                props.updateIterator(props.name);
              },
              isCheckBox: true,
              checked: props.splitterConfig.iterator === props.name,
              toolTipText: t('knowledgeTable.primaryKeyTooltip'),
            },
            {
              label: 'Use for Search',
              onClick: () => {
                props.updateTemplate(props.name);
              },
              isCheckBox: true,
              checked: props.splitterConfig.template.includes(props.name),
              toolTipText: t('knowledgeTable.useForSearchTooltip'),
            },
            {
              label: 'Use  for Instruction',
              onClick: () => {
                props.updateOutput(props.name);
              },
              isCheckBox: true,
              checked: props.splitterConfig.metadatas.output.includes(props.name),
              toolTipText: t('knowledgeTable.useForInstructionsTooltip'),
            },
          ]}></MenuItems>
      </span>
    </div>
  );
};

export const KnowledgeBaseTable = (props: IKnowledgeBaseTable) => {
  //const gridRef = useRef();
  const [tempConfig, setTempConfig] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [output, setOutput] = useState<any>();

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState(props.tableData);
  const [, setGuardsList, guardsListRef] = useStateRef<HTMLDivElement[]>([]);
  const guardRef = useRef<HTMLDivElement>(null);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      minWidth: 100,
      flex: 1,
      // cellEditor: 'agLargeTextCellEditor',
      // cellEditorPopup: true,
      // cellEditorParams: {
      //   rows: 15,
      //   cols: 50,
      //   maxLength: 20,
      // },
      //useValueFormatterForExport: false,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);

  const components = {
    agColumnHeader: CustomHeader,
  };

  useEffect(() => {
    if (rowData && rowData[0] && props.tableData && props.tableData[0]) {
      const keys1 = Object.keys(props.tableData[0]);
      const keys2 = Object.keys(rowData[0]);
      if (keys1.join('') !== keys2.join('')) {
        setRowData(props.tableData);
      }
    }
    if (rowData && rowData.length === 0 && props.tableData.length > 0) {
      setRowData(props.tableData);
    }
  }, [props.tableData]);

  useEffect(() => {
    setRowData(props.tableData);
  }, [props.activeCategoryId, props.loading]);

  //const splitercreator = useMemo((data:string)=>createSplitterConfig(data),[]);

  const updateIterator = (field: string) => {
    const cloneSpliterdata = { ...props.spliter };
    if (cloneSpliterdata.iterator === field) {
      cloneSpliterdata.iterator = '';
    } else {
      cloneSpliterdata.iterator = field;
    }
    if (props.originalSpliter !== '') {
      const tempSpliter = JSON.parse(props.originalSpliter);
      tempSpliter.iterator = field;
      props.updateSpliter(JSON.stringify(tempSpliter));
    } else {
      props.updateSpliter(makeSplitterConfig(cloneSpliterdata));
    }
  };

  const updateTemplate = (field: string) => {
    const cloneSpliter = { ...props.spliter };
    const template = [...props.spliter.template];

    if (template.includes(field)) {
      const index = template.indexOf(field);
      template.splice(index, 1);
    } else {
      template.push(field);
    }
    cloneSpliter.template = template;
    setTempConfig(makeSplitterConfig(cloneSpliter));
    setConfirm(true);
    //props.updateSpliter(makeSplitterConfig(props.spliter));
  };

  const updateOutput = (field: string) => {
    const output = [...props.spliter.metadatas.output];
    if (output.includes(field)) {
      const index = output.indexOf(field);
      output.splice(index, 1);
    } else {
      output.push(field);
    }
    setOutput(output);
    setConfirm(true);
    //props.updateSpliter(makeSplitterConfig(props.spliter));
  };

  const saveOutPutOrTemplate = () => {
    if (output) {
      const splitter = { ...props.spliter };
      splitter.metadatas.output = output;
      const newConfig = makeSplitterConfig(splitter);
      props.updateSpliter(newConfig);
      setConfirm(false);
      setTempConfig(newConfig);
      setOutput(undefined);
      return;
    }
    setConfirm(false);
    props.updateSpliter(tempConfig);
  };

  const renameColumn = (oldName: string, newName: string) => {
    //@ts-expect-error: Temp solution
    const columns = props.gridRef?.current?.api?.getColumnDefs();
    const index = columns.findIndex((el: any) => el.colId === oldName);
    columns[index].headerName = newName;
    //const colDefs = [...columns.slice(0, index), getHeaderElement(newName), ...columns.slice(index + 1)];
    //@ts-expect-error: Temp solution
    props.gridRef?.current?.api.setGridOption('columnDefs', columns);
    props.setUpdated();
  };

  const addColumnAfter = (name: string) => {
    //@ts-expect-error: Temp solution
    const columns = props.gridRef?.current?.api?.getColumnDefs();
    const index = columns.findIndex((el: any) => el.colId === name);
    const colDefs = [
      ...columns.slice(0, index + 1),
      getHeaderElement(name + '_copy', false),
      ...columns.slice(index + 1),
    ];
    //@ts-expect-error: Temp solution
    props.gridRef?.current?.api.setGridOption('columnDefs', colDefs);
    props.setUpdated();
  };

  const deleteColumn = (name: string) => {
    //@ts-expect-error: Temp solution
    const columns = props.gridRef?.current?.api?.getColumnDefs();
    const index = columns.findIndex((el: any) => el.colId === name);
    columns.splice(index, 1);
    //@ts-expect-error: Temp solution
    props.gridRef?.current?.api.setGridOption('columnDefs', columns);
    props.setUpdated();
  };

  const getHeader = (data: any): { field: string }[] => {
    const rez = [];
    let keys: any = [];
    if (data) {
      keys = Object.keys(data);
    }
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const isLast = key === keys[keys.length - 1];
        rez.push(getHeaderElement(key, isLast));
      }
    }
    return rez;
  };

  const getHeaderElement = (name: string, isLast: boolean): { field: string } => {
    const rez = {
      field: name,
      resizable: !isLast,
      headerName: name,
      headerValueGetter: (p: any) => {
        return p.colDef.headerName;
      },
      headerComponentParams: {
        name: name,
        headerName: name,
        splitterConfig: props.spliter,
        updateIterator: updateIterator,
        updateTemplate: updateTemplate,
        updateOutput: updateOutput,
        addColumnAfter,
        deleteColumn,
        renameColumn,
      },
    };
    return rez;
  };

  const stopEditing = (e: CellEditingStoppedEvent) => {
    if (e.newValue !== e.oldValue) {
      props.setUpdated();
    }
  };

  const createStyleRow = (left: number, right: number, top: number, buttom: number) => {
    return `
    z-index:2000;
    position:fixed;
    left:${left}px;
    right:${right}px;
    top:${top}px;
    bottom:${buttom}px;
    `;
  };

  const destroyGuard = (e: MouseEvent | undefined) => {
    if (e) e.stopPropagation();
    for (const iterator of guardsListRef.current) {
      document.body.removeChild(iterator);
    }
    setGuardsList([]);
  };

  const stopTriger = () => {
    //@ts-expect-error: Temp solution
    props.gridRef?.current?.api?.stopEditing();
  };

  const createGuard = () => {
    if (!guardRef?.current || guardsListRef.current.length > 0) return;
    const rect = guardRef.current.getBoundingClientRect();
    const newDivLeft = document.createElement('div');
    const newDivTop = document.createElement('div');
    const newDivButtom = document.createElement('div');
    newDivLeft.style.cssText = createStyleRow(0, window.innerWidth - rect.left, 0, 0);
    newDivTop.style.cssText = createStyleRow(0, 0, 0, window.innerHeight - rect.top);
    newDivButtom.style.cssText = createStyleRow(0, 0, rect.bottom, 0);
    const composfunc = (e: MouseEvent) => {
      destroyGuard(e);
      stopTriger();
    };
    newDivLeft.onclick = composfunc;
    newDivTop.onclick = composfunc;
    newDivButtom.onclick = composfunc;
    document.body.appendChild(newDivLeft);
    document.body.appendChild(newDivTop);
    document.body.appendChild(newDivButtom);
    setGuardsList([newDivLeft, newDivTop, newDivButtom]);
  };

  return (
    <div ref={guardRef} style={containerStyle}>
      {confirm && (
        <ConfirmModalUniversal
          disableConfirm={false}
          confirm={saveOutPutOrTemplate}
          cancel={() => {
            setConfirm(false);
            setOutput(undefined);
          }}
          title="This action may break a sensitive configuration."></ConfirmModalUniversal>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: '1 1 0', position: 'relative' }}>
          <div className={styles.gridContainer}>
            <div
              style={{ ...gridStyle, border: 'none' }}
              className={'ag-theme-quartz'}
              onMouseLeave={(e: any) => {
                //destroyGuard(e);
                stopTriger();

                //props.gridRef?.current?.api?.stopEditing();
              }}>
              <AgGridReact
                //@ts-expect-error: Temp solution
                ref={props.gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                suppressExcelExport={true}
                suppressHorizontalScroll={true}
                popupParent={popupParent}
                columnDefs={getHeader(rowData[0])}
                rowSelection="single"
                onCellEditingStopped={(e) => {
                  stopEditing(e);
                  destroyGuard(undefined);
                }}
                onCellEditingStarted={createGuard}
                suppressMovableColumns={true}
                components={components}
                suppressCsvExport={false}
                stopEditingWhenCellsLoseFocus={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
