import { useRef, useEffect } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './jsonWhite.scss';

import styles from './knowledgeBaseJson.module.scss';

export interface IJsonEditor {
  onChangeJSON: (data: any) => void;
  data: any;
}

export const KnowledgeBaseJson = (props: IJsonEditor) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JSONEditor | null>(null);
  const options = {
    mode: 'tree',
    onChangeJSON: props.onChangeJSON,
  };

  useEffect(() => {
    if (containerRef.current != null) {
      if (editorRef.current !== null) {
        editorRef.current.update(props.data);
      } else {
        //@ts-expect-error: Temp solution
        editorRef.current = new JSONEditor(containerRef.current, options);
        editorRef.current.set(props.data);
      }
    }
  }, [props.data]);

  useEffect(
    () => () => {
      editorRef.current?.destroy();
    },
    [],
  );

  return (
    <div className={styles.mainContainer}>
      <div className="jsoneditor-react-container" style={{ width: '100%', height: '100%' }} ref={containerRef} />
    </div>
  );
};
