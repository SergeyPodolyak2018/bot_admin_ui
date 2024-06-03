import { parse } from 'papaparse';
import { Edge, MarkerType, Node } from 'reactflow';
import { TCategore, TConfig, TNodeInitial, TTypeNode } from 'types';

type TTempData<T> = {
  [key: number | string]: T;
};

export const idCreator = (type: TTypeNode, id: number | string): string => {
  return type + '_' + id;
};
const idGeter = (id: string): number => {
  return Number(id.split('_')[1]);
};
const idCreatorDuplex = (id: string, id2: string): string => {
  return id + '-' + id2;
};
const getPosition = (
  id: number | string,
  type: TTypeNode,
  design: TTempData<TNodeInitial['position']>,
  incrementor: number,
): TNodeInitial['position'] => {
  if (Object.keys(design).length > 0) {
    const tempDesign = design[idCreator(type, id)] as TNodeInitial['position'];
    if (tempDesign) return tempDesign;
  }

  if (type === 'file') {
    return {
      x: -500,
      y: 80 - incrementor * 250,
    };
  }
  if (type === 'category') {
    return {
      x: 200,
      y: 80 - incrementor * 250,
    };
  }
  return {
    x: -200,
    y: 120 - incrementor * 250,
  };
};
export const getNodes = (categories: TCategore[]): Node[] => {
  const tempFiles: TTempData<Node> = {};
  const tempPromts: TTempData<Node> = {};
  const tempCategories: TTempData<Node> = {};
  let incrementator = 0;
  for (const iterator of categories) {
    let design = {};
    if (iterator.design && iterator.design !== '') {
      design = JSON.parse(iterator.design);
    }

    if (iterator.file && iterator.file.id && iterator.file.id > 0 && !tempFiles[iterator.file.id]) {
      tempFiles[iterator.file.id] = {
        id: idCreator('file', iterator.file.id),
        type: 'file',
        data: { label: iterator.file.name, value: iterator.file.id },
        position: getPosition(iterator.file.id, 'file', design, incrementator),
      };
    }
    if (iterator.prompt && iterator.prompt.id && iterator.prompt.id > 0 && !tempPromts[iterator.prompt.id]) {
      tempPromts[iterator.prompt.id] = {
        id: idCreator('promt', iterator.prompt.id),
        type: 'promt',
        data: { label: iterator.prompt.name, value: iterator.prompt.id },
        position: getPosition(iterator.prompt.id, 'promt', design, incrementator),
      };
    }
    if (!tempCategories[iterator.id]) {
      tempCategories[iterator.id] = {
        id: idCreator('category', iterator.id),
        type: 'category',
        data: {
          label: iterator.name,
          value: iterator.id,
          id: iterator.id,
          preprocessor: iterator.preprocessor,
          splitterType: iterator.splitterType,
          threshold: iterator.threshold,
        },
        position: getPosition(iterator.id, 'category', design, incrementator),
      };
    }
    incrementator = incrementator + 1;
  }
  const result = [...Object.values(tempFiles), ...Object.values(tempPromts), ...Object.values(tempCategories)];
  return result;
};
export const getNodesFromConfig = (config: TConfig): Node[] => {
  const tempFiles: TTempData<Node> = {};
  const tempPromts: TTempData<Node> = {};
  const tempCategories: TTempData<Node> = {};
  let incrementator = 0;
  for (const iterator of config.categories) {
    let design = {};
    if(iterator.deleted) continue;
    if (iterator.design && iterator.design !== '' && iterator.design !== 'default') {
      design = JSON.parse(iterator.design);
    }

    if (iterator.file && iterator.file.id   &&  !tempFiles[iterator.file.id]) {
      tempFiles[iterator.file.id] = {
        id: idCreator('file', iterator.file.id),
        type: 'file',
        data: { label: iterator.file.name, value: iterator.file.id },
        position: getPosition(iterator.file.id, 'file', design, incrementator),
      };
    }
    if (iterator.prompt && iterator.prompt.id  && !tempPromts[iterator.prompt.id]) {
      tempPromts[iterator.prompt.id] = {
        id: idCreator('promt', iterator.prompt.id),
        type: 'promt',
        data: { label: iterator.prompt.name, value: iterator.prompt.id },
        position: getPosition(iterator.prompt.id, 'promt', design, incrementator),
      };
    }
    if (!tempCategories[iterator.id]) {
      tempCategories[iterator.id] = {
        id: idCreator('category', iterator.id),
        type: 'category',
        data: {
          label: iterator.name,
          value: iterator.id,
          id: iterator.id,
          preprocessor: iterator.preprocessor,
          splitterType: iterator.splitterType,
          threshold: iterator.threshold,
        },
        position: getPosition(iterator.id, 'category', design, incrementator),
      };
    }
    incrementator = incrementator + 1;
  }
  for (const iterator of config.files) {
    //if (iterator.id && iterator.tempShowInSchema && !tempFiles[iterator.id]) {
      if(iterator.deleted) continue;
      if (iterator.id  && !tempFiles[iterator.id]) {

      let design = {};
      if (iterator.tempDisign && iterator.tempDisign !== '' && iterator.tempDisign !== 'default') {
        design = JSON.parse(iterator.tempDisign);
      }else{
        design = getPosition(iterator.id, 'file', design, incrementator);
      }
      
      tempFiles[iterator.id] = {
        id: idCreator('file', iterator.id),
        type: 'file',
        data: { label: iterator.name, value: iterator.id },
        position: design as TNodeInitial['position'],
      };
       incrementator = incrementator + 1;
    }
  }
  for (const iterator of config.prompts) {
    //if (iterator.id && iterator.tempShowInSchema && !tempPromts[iterator.id]) {
      if(iterator.deleted) continue;
      if (iterator.id  && !tempPromts[iterator.id]) {
      
      let design = {};
      if (iterator.tempDisign && iterator.tempDisign !== '' && iterator.tempDisign !== 'default') {
        design = JSON.parse(iterator.tempDisign);
      }else{
        design = getPosition(iterator.id, 'file', design, incrementator);
      }
      
      tempPromts[iterator.id] = {
        id: idCreator('promt', iterator.id),
        type: 'promt',
        data: { label: iterator.name, value: iterator.id },
        position: design as TNodeInitial['position'],
      };
       incrementator = incrementator + 1;
    }
  }

  const result = [...Object.values(tempFiles), ...Object.values(tempPromts), ...Object.values(tempCategories)];
  return result;
};

export const getEdges = (categories: TCategore[]): Edge[] => {
  const result: Edge[] = [];
  for (const iterator of categories) {
    const categoryid = idCreator('category', iterator.id);
    if (iterator.prompt && iterator.prompt.id ) {
      const promtid = idCreator('promt', iterator.prompt.id);
      const connection1 = {
        id: idCreatorDuplex(promtid, categoryid),
        source: promtid,
        target: categoryid,
        style: {
          strokeWidth: 2,
          stroke: 'rgba(73, 216, 73, 0.658)',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        type: 'custom-edge',
        animated: false,
      };
      result.push(connection1);
    }
    if (iterator.file && iterator.file.id ) {
      const fileid = idCreator('file', iterator.file.id);
      const connection2 = {
        id: idCreatorDuplex(fileid, categoryid),
        source: fileid,
        target: categoryid,
        style: {
          strokeWidth: 2,
          stroke: 'rgb(162, 162, 35)',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        type: 'custom-edge',
        animated: false,
      };
      result.push(connection2);
    }
  }

  return result;
};

export const getEdgesFromConfig = (config: TConfig): Edge[] => {
  const result: Edge[] = [];
  for (const iterator of config.categories) {
    const categoryid = idCreator('category', iterator.id);
    if (iterator.prompt && iterator.prompt.id ) {
      const promtid = idCreator('promt', iterator.prompt.id);
      const connection1 = {
        id: idCreatorDuplex(promtid, categoryid),
        source: promtid,
        target: categoryid,
        style: {
          strokeWidth: 2,
          stroke: 'rgba(73, 216, 73, 0.658)',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        type: 'custom-edge',
        animated: false,
      };
      result.push(connection1);
    }
    if (iterator.file && iterator.file.id ) {
      const fileid = idCreator('file', iterator.file.id);
      const connection2 = {
        id: idCreatorDuplex(fileid, categoryid),
        source: fileid,
        target: categoryid,
        style: {
          strokeWidth: 2,
          stroke: 'rgb(162, 162, 35)',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        type: 'custom-edge',
        animated: false,
      };
      result.push(connection2);
    }
  }

  return result;
};

//"file" | "promt" | "category"

export const categoryForUpdate = (categories: TCategore[], nodes: Node[], edges: Edge[]): Partial<TCategore>[] => {
  const tempNodeCategory = nodes.filter((el) => el.type === 'category');
  const arrayForUpdate: Partial<TCategore>[] = [];
  for (const iterator of tempNodeCategory) {
    const positions: TTempData<TNodeInitial['position']> = {};
    const realId = idGeter(iterator.id);
    const relatedEdges = edges.filter((el) => el.target === iterator.id);
    for (const i of relatedEdges) {
      const position = nodes.find((el) => el.id === i.source)?.position as TNodeInitial['position'];
      positions[i.source] = position;
    }
    positions[iterator.id] = iterator.position;
    const updatedCat = { id: realId } as Partial<TCategore>;
    const originalCat = categories.find((el) => el.id === realId);
    if (originalCat) {
      Object.assign(updatedCat, {
        design: originalCat.design,
        fileId: originalCat.file?.id || 0,
        promptId: originalCat.prompt?.id || 0,
      });
    }
    let fileId = 0;
    let promptId = 0;
    for (const i of relatedEdges) {
      const source = nodes.find((el) => el.id === i.source);
      if (source?.type === 'file') {
        fileId = idGeter(source.id);
      }
      if (source?.type === 'promt') {
        promptId = idGeter(source.id);
      }
    }
    const parsedDesign = JSON.stringify(positions);

    if (updatedCat.design !== parsedDesign || fileId !== updatedCat.fileId || updatedCat.promptId !== promptId) {
      updatedCat['design'] = JSON.stringify(positions);
      updatedCat['fileId'] = fileId;
      updatedCat['promptId'] = promptId;

      delete updatedCat.thresholdSensitive;
      arrayForUpdate.push(updatedCat);
    }
  }
  return arrayForUpdate;
};

export const fieldsSerializer = (fieldsCollector: { name: string; type: string }[], formData: any): any => {
  const target: any = {};

  for (const iterator of fieldsCollector) {
    if (iterator.type === 'number') {
      if (!isNaN(Number(formData[iterator.name as keyof typeof formData]))) {
        target[iterator.name] = Number(formData[iterator.name as keyof typeof formData]);
      }
    } else if (iterator.type === 'boolean') {
      target[iterator.name] = formData[iterator.name as keyof typeof formData] === 'on' ? true : false;
    } else {
      target[iterator.name] = formData[iterator.name as keyof typeof formData];
    }
  }
  return target;
};

export const textPreprocessor = (text: string): string => {
  const regex = /(%[A-Za-z0-9_]{2,}%)/g;
  const res = text.replace(regex, (x) => {
    // check x in dict
    return `<mark>${x}</mark>`;
  });

  return res;
};

export const textPreprocessorSpaces = (text: string): string => {
  const regex = /([\s]{1,})/g;
  const res = text.replace(regex, (x) => {
    // check x in dict
    return `<i>${x}</i>`;
  });

  return res;
};

export const textPreprocessorBrackeLines = (text: string): string => {
  const regex = /\n/g;
  const res = text.replace(regex, '\n<br>');

  return res;
};

/* eslint-disable */
export const csvToJSON = (text: string): any[] => {
  const result = parse(text, { header: true, skipEmptyLines: 'greedy' });
  return result.data;
};

export const csvToArray = (text: string): { columns: string[]; data: string[][] } => {
  const array = text.toString().split('\r\n');

  let headersstring = array.shift() as never as string;

  const headers = headersstring.split(',').map((el) => el.replace('"', '').replace('"', '').trim());
  const data: string[][] = [];
  for (const iterator of array) {
    if (iterator !== '') {
      const subData = iterator.split(',');
      const filteredData = subData.map((el) => el.replace('"', '').replace('"', '').trim());
      if (filteredData.length > 0) {
        data.push(filteredData);
      }
    }
  }
  return {
    columns: headers,
    data,
  };
};

type TRule={
  [key:string]:(val:string)=>string | undefined
}
const checkRule:TRule = {
  'bot.greeting':(val)=>{
    if(typeof val === 'string'){
      if(val.length<20){
        return 'The greeting field is too short, minimum 20 characters.'
      }
    }
    return;
  }
}

export const checkFields = (item:string, field:string, value:any):string | undefined=>{
  const rule =  checkRule[item + '.' + field];
  if(typeof rule === 'function'){
    return rule(value)
  }
  return;

}