import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import AddIconMui from '@mui/icons-material/Add';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteIconMui from '@mui/icons-material/Delete';
import { TextField, InputAdornment } from '@mui/material';
import Input from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';

import { MenuItems, SquareTabs } from 'components/common';
import { InputWithMarkedWordsDrag } from 'components/common/InputWithMarkedWordsDrag';
import { ConfirmModalUniversal } from 'components/features/common/ConfirmationModalUniversal/ConfirmModalUniversal';
import { ChangeEvent, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useStateRef from 'react-usestateref';
import { fetchFileById } from 'services/api';
import AddRowIcon from '../../../../assets/svg/AddIcon.svg';
import BroomIcon from '../../../../assets/svg/BroomIcon.svg';
import DeleteRowIcon from '../../../../assets/svg/DeleteIcon.svg';

import {
  addNewFile,
  addPackage,
  cloneCategory,
  changeCategoryName,
  cleanFileById,
  markAsDeletedCategory,
  setFile,
  setImportFile,
  setPromptById,
  setSplitter,
  addNotification,
  useAppSelector,
  getConfig,
} from 'store';
import { TCategore, TConfig, TFile } from 'types';
import { csvToJSON, textPreprocessor, textPreprocessorBrackeLines } from 'utils/botUtils';
import logger from 'utils/logger.ts';

import { TagsMap } from 'utils/tagsMap';
import { createSplitterConfig, getAllDefaultTyps, getDefaultFileWithData } from 'utils/template.ts';
import AddIcon from '../../../../assets/svg/Add.svg';
import ExportIcon from '../../../../assets/svg/export.svg';
import ImportIcon from '../../../../assets/svg/import.svg';
import { AdvancedConfig } from './AdvancedConfig/AdvancedConfig';
import { InitBanner } from './InitBanner/InitBanner';
import { InitCategoryBanner } from './InitCategoryBanner/InitCategoryBanner';
import styles from './knowledgeBase.module.scss';
import { KnowledgeBaseJson } from './KnowledgeBaseJson/KnowledgeBaseJson';
import { KnowledgeBaseTable } from './KnowledgeBaseTable/KnowledgeBaseTable';
import { DotsButton } from './DotsButton/dotsButton';
import { useMediaQuery } from '@material-ui/core';
const TextareaAutosizeStyled = styled(TextareaAutosize)(
  ({ theme }) => `
  padding: 8px 14px;
  border-radius: 10px;
`,
);
type TProps = {
  data: TConfig;
  loading: boolean;
  idSaver: {
    newId: number;
    iterate: (id: number) => void;
  };
};

export const ItemTypes = {
  OPTION: 'option',
};

export type Ttable = {
  columns: string[];
  data: string[][];
};

export interface ISplitterConfig {
  iterator: string;
  template: string[];
  metadatas: {
    output: string[];
    h_output: string[];
    h_template: string[];
  };
}

export interface ISplitterConfigIncom {
  iterator: string;
  template: string;
  metadatas: {
    output: string;
    h_output: string;
    h_template: string;
  };
}

export const VisuallyHiddenInput = styled('input')({
  height: '100%',
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: '100%',
  zIndex: '2000',
});

export interface IOptionItem {
  viewLabel: string;
  isActive: boolean;
  label: string;
}

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    border-radius: 10px;
    border-color: #d8dbdf;
  }

  & .MuiInputLabel-root {
    color: #b3b3b3;
  }
`;

export const KnowldgeBase = (props: TProps) => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const dispatch = useDispatch();
  const gridRef = useRef();
  const inputRefTxt = useRef<HTMLTextAreaElement | null>(null);
  const [activetab, setActiveTab] = useState('data');
  const [newCategoryName, setNewCategoryName] = useState('');
  const config = useAppSelector(getConfig);
  // const [activeCategory, setActiveCategory, activeCategoryRef] = useStateRef(
  //   props.data.categories.find((el) => !el.deleted)!,
  // );
  const [activeCategory, setActiveCategory, activeCategoryRef] = useStateRef(
    props.data.categories.find((el) => !el.deleted)?.id,
  );
  const [newCategory, setNewCategory] = useState(false);
  const [fileUpdated, setFileUpdated] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);
  const [eraceFile, setEraceFile] = useState(false);
  const [fileImporting, setFileImporting] = useState(false);
  const [renameCategory, setRenameCategory] = useState<number | null>(null);
  const [nextActiveCategory, setNextActiveCategory] = useState<number | undefined>();

  const inputRef = useRef<any>();

  const getPromptById = (promptId: number) => {
    const posiblPrompt = props.data.prompts.find((el) => el.id === promptId);
    return posiblPrompt;
  };

  const getCategoryById = (catId: number | undefined) => {
    if (!catId) return;
    const posiblCat = props.data.categories.find((el) => el.id === catId);
    return posiblCat!;
  };

  const changeContent = (promptId: number) => {
    const tagifyInput = document.getElementsByClassName('tagify__input');

    Array.from(tagifyInput).forEach((element) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(element.innerHTML, 'text/html');
      const tags = doc.querySelectorAll('tag');

      tags.forEach((tag) => {
        const title = tag.getAttribute('title');
        const currentTag = TagsMap.find((x) => x.label === title || x.viewLabel === title);

        if (currentTag) {
          const newText = currentTag.label;
          const textNode = doc.createTextNode(newText);
          tag.replaceWith(textNode);
        } else {
          const newText = '%file%';
          const textNode = doc.createTextNode(newText);
          tag.replaceWith(textNode);
        }
      });
      const prewcontent = getPromptById(getCategoryById(activeCategory)?.prompt?.id!)?.text;
      if (prewcontent === '' && doc.body.innerText === '') return;
      dispatch(setPromptById({ id: promptId, value: doc.body.innerText }));
    });
  };

  const changeCategoty = (category: TCategore) => {
    if (!fileUpdated) {
      setActiveCategory(category.id);
    } else {
      setNextActiveCategory(category.id);
      setSaveChanges(true);
    }
  };

  const addRow = () => {
    //@ts-expect-error: Temp solution
    const val = gridRef?.current?.api?.applyTransaction({ add: [{}] });

    //console.log(val.add[0]);
    //@ts-expect-error: Temp solution
    gridRef?.current?.api?.ensureIndexVisible(val.add[0].rowIndex, 'middle');

    // var firstEditCol = gridRef?.current?.api?.getAllDisplayedColumns()[0];

    //gridRef?.current?.api?.setFocusedCell(val.add[0].rowIndex, firstEditCol);
  };

  const changeAndNotSave = () => {
    if (nextActiveCategory) {
      setActiveCategory(nextActiveCategory);
      setNextActiveCategory(undefined);
      setFileUpdated(false);
      setSaveChanges(false);
    }
  };

  const changeAndSave = () => {
    logger.debug('changeAndSave');
  };

  const initFile = (extension: 'csv' | 'txt' | 'json') => {
    if (!activeCategory) return;
    const enc = new TextEncoder();
    let defaultText = '';
    if (extension === 'csv') {
      defaultText = '"column",\n"value"';
    }
    if (extension === 'json') {
      defaultText = '{}';
    }

    const rez = enc.encode(defaultText);
    // const activeFile = csvToJSON(text as string);
    dispatch(
      setImportFile({
        id: getCategoryById(activeCategory)?.file?.id!,
        value: rez,
        name: `default.${extension}`,
        extension,
      }),
    );
  };
  const createNewFile = (extension: 'csv' | 'txt' | 'json') => {
    const enc = new TextEncoder();
    let defaultText = '';
    if (extension === 'csv') {
      defaultText = '"column",\n"value"';
    }
    if (extension === 'json') {
      defaultText = '{}';
    }

    const rez = enc.encode(defaultText);
    // const activeFile = csvToJSON(text as string);

    const unionid = props.idSaver.newId - 1;
    const name = '';

    const file = getDefaultFileWithData(
      name,
      unionid,
      props.data.bot?.id || '',
      props.data.bot?.organization.id as number,
      props.data.bot?.organization.name as string,
      rez,
      extension,
    );

    //changeCategoty(tempCategory as unknown as TCategore);
    if (!activeCategory) return;
    dispatch(addNewFile({ categotyid: activeCategory, file }));
    props.idSaver.iterate(unionid);
  };

  const cleanFile = () => {
    if (!activeCategory) return;
    const fileId = getCategoryById(activeCategory)?.file?.id!;
    if (fileId) {
      dispatch(cleanFileById({ id: fileId }));
    }
  };

  useEffect(() => {
    if (activeCategory) {
      if (!getFileById(getCategoryById(activeCategory)?.file?.id!)?.file) {
        const category = props.data.categories.find((el) => el.id === activeCategory);
        const fileId = category?.file?.id;
        fileId && getFile(fileId as number);
      }
    }
  }, [activeCategory, props.data]);

  useEffect(() => {
    if (!activeCategoryRef.current) return;
    if (!props.loading && activeCategoryRef.current < 0) {
      if (props.data.categories && props.data.categories[0]) {
        if (props.data.categories.findIndex((el) => el.id == activeCategoryRef.current) > -1) {
          setActiveCategory(activeCategoryRef.current);
        } else {
          setActiveCategory(props.data.categories[0].id);
        }
      }
    }
  }, [props.loading]);

  // useEffect(() => {
  //   if (activeCategory) {
  //     if (!getFileById(activeCategory.file?.id)?.file) {
  //       const category = props.data.categories.find((el) => el.id === activeCategory.id);
  //       const fileId = category?.file?.id;
  //       fileId && getFile(fileId as number);
  //     }
  //   }
  // }, [props.loading]);

  const getFile = async (fileId: number) => {
    const posiblFile = getFileById(fileId);
    if (!posiblFile?.file?.data) {
      fetchFileById(fileId).then((resp) => {
        const bytes = new Uint8Array(resp.data.file.data);
        dispatch(setFile({ id: fileId, value: bytes as Buffer }));
        // const text = utf8decoder.decode(bytes);
        // const activeFile = csvToJSON(text);
        // setActiveFile(activeFile);
      });
    }
  };

  const getFileById = (fileId: number) => {
    const posiblFile = props.data.files.find((el) => el.id === fileId);
    return posiblFile!;
  };

  const getFileInJSON = (file: ArrayBuffer | undefined): any[] => {
    if (file && file.byteLength > 0) {
      const utf8decoder = new TextDecoder('utf-8');
      const text = utf8decoder.decode(file);
      const activeFile = csvToJSON(text);
      return activeFile;
    } else {
      return [];
    }
  };
  const getFileInTxt = (file: ArrayBuffer | undefined): string => {
    if (file && file.byteLength > 0) {
      const utf8decoder = new TextDecoder('utf-8');
      return utf8decoder.decode(file);
    } else {
      return '';
    }
  };

  const getFileInPuarJSON = (file: ArrayBuffer | undefined): any => {
    if (file && file.byteLength > 0) {
      try {
        const utf8decoder = new TextDecoder('utf-8');
        const text = utf8decoder.decode(file);
        const activeFile = JSON.parse(text);

        return activeFile;
      } catch (err) {
        logger.debug(err);
        return {};
      }
    } else {
      return {};
    }
  };

  const deleteCategory = (deletedCategory: TCategore) => {
    if (activeCategory === deletedCategory.id) {
      const catCandidat = props.data.categories.find((el) => el.id !== deletedCategory.id && !el.deleted);
      if (catCandidat) {
        changeCategoty(catCandidat);
      }
    }
    dispatch(markAsDeletedCategory({ id: deletedCategory.id }));
  };
  const renameCategoryAction = (event: KeyboardEventHandler<HTMLDivElement>) => {
    //@ts-expect-error: Temp solution
    if (event.code === 'Enter') {
      //@ts-expect-error: Temp solution
      const name = event.target?.value;

      if (name && name !== '' && typeof renameCategory === 'number') {
        dispatch(changeCategoryName({ id: renameCategory, name }));
        setRenameCategory(null);
      }
    }
  };
  const renameCategoryActionOnBlure = (name: string) => {
    if (name && name !== '' && typeof renameCategory === 'number') {
      dispatch(changeCategoryName({ id: renameCategory, name }));
      setRenameCategory(null);
    }
  };
  const discardRename = () => {
    setRenameCategory(null);
  };

  const duplicateCategory = async (duplicatedCategory: TCategore) => {
    const unionid = props.idSaver.newId - 1;
    if (!getFileById(getCategoryById(duplicatedCategory.id)?.file?.id!)?.file) {
      const category = props.data.categories.find((el) => el.id === duplicatedCategory.id);
      const fileId = category?.file?.id;
      if (fileId) {
        await fetchFileById(fileId).then((resp) => {
          const bytes = new Uint8Array(resp.data.file.data);
          dispatch(setFile({ id: fileId, value: bytes as Buffer }));
          dispatch(cloneCategory({ categoryid: duplicatedCategory.id, newId: unionid }));
          // const text = utf8decoder.decode(bytes);
          // const activeFile = csvToJSON(text);
          // setActiveFile(activeFile);
        });
      } else {
        dispatch(cloneCategory({ categoryid: duplicatedCategory.id, newId: unionid }));
      }
    } else {
      dispatch(cloneCategory({ categoryid: duplicatedCategory.id, newId: unionid }));
    }

    //dispatch(cloneCategory({ categoryid: duplicatedCategory.id, newId: unionid }));
    props.idSaver.iterate(unionid);
    //dispatch(markAsDeletedCategory({ id: deletedCategory.id }));
  };

  const createNewCategoryHandler: KeyboardEventHandler<HTMLDivElement> & MouseEventHandler<HTMLDivElement> = (
    event: any,
  ) => {
    let isKeyboardAction = event.hasOwnProperty('code');
    let isMouseAction = event.hasOwnProperty('clientX');

    if (isKeyboardAction) {
      const keyboardEvent = event as React.KeyboardEvent<HTMLDivElement>;
      if (keyboardEvent.code === 'Enter') {
        const target = keyboardEvent.target as HTMLInputElement;
        const name = target.value;
        processCategoryCreation(name);
      }
    } else if (isMouseAction) {
      processCategoryCreation(newCategoryName);
    }
  };

  const processCategoryCreation = (name: string) => {
    if (name && name.trim() !== '') {
      const unionid = props.idSaver.newId - 1;
      const data = getAllDefaultTyps(
        name,
        unionid,
        props.data.bot?.id || '',
        props.data.bot?.organization.id as number,
        props.data.bot?.organization.name as string,
      );
      props.idSaver.iterate(unionid);
      dispatch(addPackage(data));
      setNewCategoryName('');
    }
  };

  const isFileAllowed = (allowedExtensions: any, file: any) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowed = allowedExtensions.split('.').pop().toLowerCase();
    const isExtensionAllowed = allowedExtensions.includes(`.${fileExtension}`);
    return isExtensionAllowed;
  };

  const importFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!activeCategory) return;
    event.preventDefault();
    setFileImporting(true);

    const allowedExtensions = '.csv, .txt, .json';

    const file = event.target?.files && event.target?.files[0];
    if (!file) return;

    if (file) {
      if (!isFileAllowed(allowedExtensions, file)) {
        dispatch(
          addNotification({
            type: 'error',
            title: 'File importing',
            message: `Allowed extentions to import are: ${allowedExtensions}`,
          }),
        );
        return;
      }
    }

    const extensionArr = file.name.split('.');
    const extension = extensionArr[extensionArr.length - 1] as 'txt' | 'csv' | 'json' | '';
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result;
      if (typeof text === 'string') {
        const enc = new TextEncoder();
        const rez = enc.encode(text);
        // const activeFile = csvToJSON(text as string);

        if (getCategoryById(activeCategory)?.file?.id) {
          dispatch(
            setImportFile({ id: getCategoryById(activeCategory)?.file?.id!, value: rez, name: file.name, extension }),
          );
          setFileImporting(false);
        } else {
          const unionid = props.idSaver.newId - 1;
          const localfile = getDefaultFileWithData(
            file.name,
            unionid,
            props.data.bot?.id || '',
            props.data.bot?.organization.id as number,
            props.data.bot?.organization.name as string,
            rez,
            extension,
          );

          //changeCategoty(tempCategory as unknown as TCategore);
          dispatch(addNewFile({ categotyid: activeCategory, file: localfile }));
          props.idSaver.iterate(unionid);
        }

        //setActiveFile(activeFile);
      }
    };
    reader.readAsText(file);
  };
  const exportByExtension = (extension: string) => {
    if (extension === 'csv') return void exportFileFromTable();
    if (extension === 'txt') return void exportFileFromText();
    if (extension === 'json') return void exportFileFromJson();
  };

  const exportFileFromTable = useCallback(() => {
    if (!activeCategoryRef.current) return;
    //@ts-expect-error: Temp solution
    const file = gridRef?.current?.api?.exportDataAsCsv();
    if (!file) return;
    download(getFileById(getCategoryById(activeCategoryRef.current)?.file?.id!).name, file);
  }, []);

  const exportFileFromText = useCallback(() => {
    if (!activeCategoryRef.current) return;
    const file = inputRefTxt.current?.innerHTML as string;
    if (!file) return;
    download(getFileById(getCategoryById(activeCategoryRef.current)?.file?.id!).name, file);
  }, []);

  const exportFileFromJson = () => {
    if (!activeCategoryRef.current) return;

    const category = getCategoryById(activeCategoryRef.current);
    if (!category) return;

    const fileId = category.file?.id;
    if (!fileId) return;
    const fileData = getFileById(fileId)?.file?.data;

    if (!fileData) return;

    const jsonText = JSON.stringify(JSON.parse(new TextDecoder('utf-8').decode(fileData)), null, 2);

    const fileName = `${getFileById(fileId)?.name}`;

    downloadJson(fileName, jsonText);
  };

  const download = (filename: string, text: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJson = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename + '.json');
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    URL.revokeObjectURL(url);
  };

  const fileDetectUpdation = () => {
    if (!activeCategory) return;
    //@ts-expect-error: Temp solution
    const file = gridRef?.current?.api?.getDataAsCsv();
    const enc = new TextEncoder();
    const rez = enc.encode(file);
    // const activeFile = csvToJSON(text as string);
    dispatch(setFile({ id: getCategoryById(activeCategory)?.file?.id!, value: rez }));
  };

  const changeTxtFileContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeCategory) return;
    const data = event.target.value;
    const enc = new TextEncoder();
    const rez = enc.encode(data);
    dispatch(setFile({ id: getCategoryById(activeCategory)?.file?.id!, value: rez }));
  };
  const changeSpliterFileContent = (spliter: string) => {
    if (!activeCategory) return;
    dispatch(setSplitter({ id: activeCategory, value: spliter }));
  };

  const changeJsonFileContent = (data: any) => {
    if (!activeCategory) return;
    const stringData = JSON.stringify(data);
    const enc = new TextEncoder();
    const rez = enc.encode(stringData);
    dispatch(setFile({ id: getCategoryById(activeCategory)?.file?.id!, value: rez }));
  };
  const formatedText = (text: string) => {
    const updatedText = text.replace(/%([^%]+)%/g, (match) => {
      const tag = TagsMap.find((x) => x.label === match);
      if (tag) {
        const replacement = tag.viewLabel;
        return `[[{"value":${JSON.stringify(replacement)}}]]`;
      }

      return match;
    });
    return `${updatedText}`;
  };
  const deleteRow = () => {
    //@ts-expect-error: Temp solution
    const selectedRows = gridRef?.current?.api?.getSelectedRows();
    if (selectedRows) {
      //@ts-expect-error: Temp solution
      gridRef?.current?.api?.applyTransaction({ remove: selectedRows });
      fileDetectUpdation();
    }
  };

  const handleTextChange = (event: any) => {
    setNewCategoryName(event.target.value);
  };
  return (
    <div className={styles.container}>
      {saveChanges && (
        <ConfirmModalUniversal
          disableConfirm={false}
          confirm={changeAndSave}
          cancel={changeAndNotSave}
          title="Save changes?"></ConfirmModalUniversal>
      )}
      {eraceFile && (
        <ConfirmModalUniversal
          disableConfirm={false}
          confirm={cleanFile}
          cancel={() => {
            setEraceFile(false);
          }}
          title="Clean File">
          <span>Are you sure you want to delete the file?</span>
        </ConfirmModalUniversal>
      )}
      <div className={styles.contentWrapper}>
        <div className={styles.categoriesWrapper}>
          <span className={styles.title}>Knowledge Categories</span>
          <div className={styles.wrapper}>
            <div className={styles.buttonHolder}>
              <div className={styles.addCategoryButton}>
                <StyledTextField
                  value={newCategoryName}
                  onChange={handleTextChange}
                  onKeyUp={createNewCategoryHandler}
                  variant="outlined"
                  sx={{ width: '100%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img className={styles.icon} src={AddIcon} alt="AddIcon" onClick={createNewCategoryHandler} />
                      </InputAdornment>
                    ),
                    inputProps: {
                      style: {
                        padding: isMobile ? '13px 8px 6px 8px' : '17.5px 14px',
                        paddingBottom: '12px',
                        width: '100%',
                      },
                    },
                  }}
                  placeholder="Enter New Category"
                />
              </div>
            </div>
            <div className={styles.categoriesHolder}>
              {newCategory && (
                <div className={styles.new_category}>
                  <TextField
                    name={'name'}
                    label={'Name'}
                    variant="standard"
                    defaultValue={''}
                    type={'text'}
                    onKeyUp={createNewCategoryHandler}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {props.data.categories.map(
                (el, index) =>
                  !el.deleted && (
                    <div className={styles.category} key={index}>
                      {renameCategory && renameCategory === el.id ? (
                        <div className={styles.new_category}>
                          <Input
                            name={'name'}
                            variant="standard"
                            defaultValue={el.name}
                            type={'text'}
                            //@ts-expect-error: Temp solution
                            onKeyUp={renameCategoryAction}
                            onBlurCapture={(e) => {
                              if (e.relatedTarget?.classList.contains('closeRenameButton')) {
                                discardRename();
                              } else {
                                //@ts-expect-error: Temp solution
                                renameCategoryActionOnBlure(e.target?.value);
                              }
                            }}
                            autoFocus={true}
                            style={{ width: 'calc(100% - 14px)', height: '32px', marginLeft: '14px' }}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  className="closeRenameButton"
                                  aria-label="toggle password visibility"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    discardRename();
                                  }}>
                                  <HighlightOffSharpIcon style={{ color: '#1f1f1f' }} />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </div>
                      ) : (
                        <div
                          className={`${styles.categoryHolder} ${el.id === activeCategory && styles.active}`}
                          onClick={() => {
                            changeCategoty(el);
                          }}>
                          {el.name.length > 16 ? (
                            <Tooltip title={el.name}>
                              <span className={styles.label}>{el.name}</span>
                            </Tooltip>
                          ) : (
                            <span className={styles.label}>{el.name}</span>
                          )}

                          <span className={styles.deleteHolder}>
                            <MenuItems
                              menuItems={[
                                {
                                  label: 'Duplicate',
                                  onClick: () => duplicateCategory(el),
                                },
                                {
                                  label: 'Rename',
                                  onClick: () => setRenameCategory(el.id),
                                },
                                {
                                  label: 'Delete',
                                  onClick: () => deleteCategory(el),
                                },
                              ]}></MenuItems>
                          </span>
                        </div>
                      )}
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
        <div className={styles.dataWrapper}>
          <div className={styles.switcherWrapper}>
            <SquareTabs
              tabs={[
                {
                  label: 'Data',
                  name: 'data',
                  width: '36px',
                  disabled: !activeCategory || !config.categories.length,
                },
                {
                  label: 'Instructions',
                  name: 'instructions',
                  width: '95px',
                  disabled: !activeCategory || !config.categories.length,
                },
                {
                  label: 'Advanced',
                  name: 'advanced',
                  width: '76px',
                  disabled: !activeCategory || !config.categories.length,
                },
              ]}
              onClick={(name) => {
                if (activeCategory) {
                  setActiveTab(name);
                }
              }}
              active={activetab}
            />
            {activetab === 'data' && getCategoryById(activeCategory) && (
              <>
                <div className={styles.fileActionButton}>
                  <DotsButton
                    menuItems={[
                      {
                        component: (
                          <div className={styles.button}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: '8px',
                              }}>
                              <img src={ImportIcon} alt="Import" />
                              <span
                                className={styles.label}
                                style={{ fontSize: '16px', color: '#1f1f1f', fontFamily: 'Helvetica Neue' }}>
                                Import
                              </span>
                            </div>
                            <input
                              type="file"
                              name="image"
                              className={styles.hidden}
                              style={{
                                padding: '0',
                                cursor: 'pointer',
                                position: 'absolute',
                                top: '0%',
                                left: '0',
                                right: '0%',
                                bottom: '0',
                                opacity: '0',
                                overflow: 'hidden',
                              }}
                              accept={
                                !getCategoryById(activeCategory)?.file ||
                                getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === ''
                                  ? '.csv,.txt,.json'
                                  : '.' + getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension
                              }
                              onChange={importFile}
                            />
                          </div>
                        ),
                        render: true,
                      },
                      {
                        label: 'Export',
                        icon: ExportIcon,
                        onClick: () => {
                          exportByExtension(getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension);
                        },
                        disabled: getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === '',
                        render: true,
                      },
                      {
                        label: 'Add Row',
                        icon: AddRowIcon,
                        onClick: addRow,
                        render: getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === 'csv',
                      },
                      {
                        label: 'Clean',
                        icon: BroomIcon,
                        onClick: () => {
                          setEraceFile(true);
                        },
                        render: true,
                        disabled: getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === '',
                      },
                      {
                        label: 'Delete Row',
                        icon: DeleteRowIcon,
                        onClick: deleteRow,
                        render: getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === 'csv',
                      },
                    ]}
                  />
                </div>
                <div className={styles.filesActionButtons}>
                  {getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === 'csv' && (
                    <>
                      <div className={styles.button} onClick={addRow}>
                        <img src={AddRowIcon} alt="Import" />
                        <span className={styles.label}>Add Row</span>
                      </div>
                      <div className={styles.button} onClick={deleteRow}>
                        <img src={DeleteRowIcon} alt="Import" />
                        <span className={styles.label}>Delete Row</span>
                      </div>
                    </>
                  )}

                  <div className={styles.button}>
                    <img src={ImportIcon} alt="Import" />
                    <span className={styles.label}>Import</span>
                    <input
                      type="file"
                      name="image"
                      className={styles.hiden}
                      accept={'.csv,.txt,.json'}
                      value=""
                      onChange={importFile}
                    />
                  </div>
                  <div
                    className={`${styles.button} ${getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === '' ? styles.button__disabled : ''}`}
                    onClick={() => {
                      exportByExtension(getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension);
                    }}>
                    <img src={ExportIcon} alt="Export" />
                    <span className={styles.label}>Export</span>
                  </div>
                  <div
                    className={`${styles.button} ${getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === '' ? styles.button__disabled : ''}`}
                    onClick={() => {
                      setEraceFile(true);
                    }}
                    style={{ height: '42px' }}>
                    <img src={BroomIcon} alt="Clean" />
                    <span className={`${styles.label}`}>Clean</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {!activeCategory && (
            <div className={styles.tableWrapper}>
              <InitCategoryBanner init={initFile} />
            </div>
          )}
          {activetab === 'data' && getCategoryById(activeCategory) && (
            <div className={styles.tableWrapper}>
              {getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === 'csv' && (
                <KnowledgeBaseTable
                  tableData={getFileInJSON(getFileById(getCategoryById(activeCategory)?.file?.id!)?.file?.data)}
                  gridRef={gridRef}
                  setUpdated={fileDetectUpdation}
                  spliter={createSplitterConfig(
                    getCategoryById(getCategoryById(activeCategory)?.id)?.splitterConfig || '',
                  )}
                  updateSpliter={changeSpliterFileContent}
                  originalSpliter={getCategoryById(activeCategory)?.splitterConfig || ''}
                  activeCategoryId={activeCategory || 0}
                  loading={props.loading || fileImporting}
                />
              )}
              {getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === 'txt' && (
                <TextareaAutosizeStyled
                  id="fileName"
                  name="text"
                  maxRows={20}
                  style={{
                    height: '100%',
                    width: '100%',
                    fontSize: '16px',
                  }}
                  ref={inputRefTxt}
                  onChange={changeTxtFileContent}
                  value={getFileInTxt(getFileById(getCategoryById(activeCategory)?.file?.id!)?.file?.data)}
                />
              )}
              {getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === 'json' && (
                <KnowledgeBaseJson
                  data={getFileInPuarJSON(getFileById(getCategoryById(activeCategory)?.file?.id!)?.file?.data)}
                  onChangeJSON={(data) => {
                    changeJsonFileContent(data);
                  }}
                />
              )}
              {getFileById(getCategoryById(activeCategory)?.file?.id!)?.extension === '' && (
                <InitBanner init={initFile} />
              )}
              {getCategoryById(activeCategory)?.file === null && <InitBanner init={createNewFile} />}
            </div>
          )}{' '}
          {activetab === 'instructions' && getCategoryById(activeCategory) && (
            <div className={styles.tableWrapper}>
              <div className={styles.systemInstructionsWrapper}>
                <span className={styles.label}>
                  Short description of AI Agent&apos;s general behavior for the current knowledge base category. Use the{' '}
                  <span className={styles.tag}>@</span> character to insert templates.
                </span>
                <span className={styles.label}>
                  E.g. <span className={styles.tag}>@data</span> will resolve into your knowledge base
                </span>
                {/* <TagsManager
                  activeCategory={activeCategory.name}
                  onDragTagCallback={setDraggableTag}
                  options={options}
                /> */}
              </div>

              <InputWithMarkedWordsDrag
                reference={inputRef}
                activeCategory={getCategoryById(activeCategory)}
                text={formatedText(getPromptById(getCategoryById(activeCategory)?.prompt?.id!)?.text || '')}
                lable={''}
                preprocessors={[textPreprocessor, textPreprocessorBrackeLines]}
                style={{ width: 'calc(100% - 30px)', height: '100%' }}
                wrapperstyle={{
                  width: '100%',
                  flex: 1,
                  marginTop: '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  // justifyContent: 'space-between',
                }}
                keyup={changeContent}
                activeCategoryName={getCategoryById(activeCategory)?.name!}
              />
            </div>
          )}
          {activetab === 'advanced' && getCategoryById(activeCategory) && (
            <AdvancedConfig category={getCategoryById(activeCategoryRef.current)!} />
          )}
        </div>
      </div>
    </div>
  );
};
