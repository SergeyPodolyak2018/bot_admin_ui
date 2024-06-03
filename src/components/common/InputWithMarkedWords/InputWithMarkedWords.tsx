import InputLabel from '@mui/material/InputLabel';
import { Tag } from 'components/features/Tags/Tag.tsx';
import { useEffect, useRef } from 'react';
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import {
  getCaretPosition,
  insertElementAfterSpan,
  insertElementAtCaret,
  isCursorOverSpanElement,
  setCaretPosition,
} from 'utils/tagsDNDUtils.ts';
import { ITag, TagsMap } from 'utils/tagsMap.ts';
import { pipe } from '../../../utils/pipe.ts';
import styles from './InputWithMarkedWords.module.scss';
import { IInputWithMarkedWordsProps } from './InputWithMarkedWords.types.ts';

export const InputWithMarkedWords = (props: IInputWithMarkedWordsProps) => {
  const {
    reference,
    preprocessors,
    text,
    lable,
    style,
    keyup,
    activeCategory,
    draggableTag,
    onDropCallback,
    onTagCloseCallback,
    onInitialTagsRender,
    isInstructions,
    wrapperstyle,
  } = props;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const preprocessCollector = pipe<string>(...preprocessors);

  const handleCloseButton = (event: MouseEvent, id: string) => {
    onTagCloseCallback && onTagCloseCallback(id);

    // if (event.target) {
    //   setCaretPosition(event.target as HTMLDivElement, 0);
    // }

    const parentElement = (event.target as HTMLElement).parentNode;
    // const parentDiv = parent as HTMLDivElement;
    if (parentElement) {
      const parentDiv = parentElement as HTMLElement;
      const space = document.createTextNode(' ');
      parentDiv.parentNode?.insertBefore(space, parentDiv);
      parentDiv.parentNode?.removeChild(parentDiv);
    }
    // parentDiv.normalize();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.focus();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggableTag) return;

    const target = e.currentTarget;

    const tagNode = document.createElement('div');
    const TagComponent = (
      <Tag
        key={1}
        tag={draggableTag}
        dropped={true}
        isActive={true}
        label={
          draggableTag?.useCategoryName
            ? activeCategory
              ? activeCategory
              : draggableTag.label
            : draggableTag.viewLabel
        }
      />
    );
    render(TagComponent, tagNode);
    const caretPosition = getCaretPosition(e.clientX, e.clientY);
    const draggedElement = tagNode.firstChild as HTMLElement;
    const thirdChild = draggedElement.children[2] as HTMLElement;
    thirdChild?.addEventListener('click', (e) => handleCloseButton(e, draggableTag.label));

    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    const isCursorOverSpan = isCursorOverSpanElement(e.clientX, e.clientY);

    if (isCursorOverSpan) {
      insertElementAfterSpan(draggedElement, e.clientX, e.clientY);
    } else if (range) {
      range.insertNode(draggedElement);
    } else {
      insertElementAtCaret(target, draggedElement, caretPosition);
      setCaretPosition(target, caretPosition);
      target.appendChild(draggedElement);
    }

    onDropCallback && onDropCallback();
  };

  useEffect(() => {
    if (!isInstructions) {
      return;
    }
    const target = reference.current;
    if (!target) return;
    const tags: ITag[] = [];
    const nodes = Array.from(target.childNodes) as Node[];
    // Clear the target
    target.innerHTML = '';
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node.textContent as string).trim();
        const words = text.split(/\s+/);
        words.forEach((word, index) => {
          const spanNode = document.createElement('span');
          spanNode.textContent = word;
          if (word.toLowerCase() === 'ts' || word.toLowerCase() === 'react') {
            spanNode.classList.add('highlighted');
          }
          target.appendChild(spanNode);
          if (index !== words.length - 1) {
            target.appendChild(document.createTextNode(' '));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName === 'MARK') {
          const text = element.textContent?.trim();
          if (text) {
            const tagInfo = TagsMap.find((tagInfo) => tagInfo.label === text);
            if (tagInfo) {
              const tagNode = document.createElement('span');
              const TagComponent = (
                <Tag
                  key={1}
                  tag={tagInfo}
                  dropped={true}
                  isActive={true}
                  label={
                    tagInfo?.useCategoryName ? (activeCategory ? activeCategory : tagInfo.label) : tagInfo.viewLabel
                  }
                  onClose={(e) => handleCloseButton(e, tagInfo.label)}
                />
              );
              tags.push(tagInfo);
              render(TagComponent, tagNode);
              target.appendChild(tagNode);
            } else {
              const spanNode = document.createElement('span');
              spanNode.textContent = text;
              target.appendChild(spanNode);
            }
          }
        } else if (element.tagName === 'BR') {
          target.appendChild(document.createElement('br'));
        }
      }
    });
    onInitialTagsRender && onInitialTagsRender(tags);
  }, [text]);

  const keyUp = () => {
    if (keyup) {
      timerRef.current && clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => keyup(), 2000);
    }
  };

  return (
    <div className={styles.editableWrapper} style={wrapperstyle}>
      <InputLabel id={'editableDiv'} className={styles.customLable}>
        {lable}
      </InputLabel>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyUp={keyUp}
        ref={reference}
        id={'editableDiv'}
        className={styles.pseudoInput}
        style={style}
        contentEditable={true}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{
          __html: preprocessCollector(text),
        }}
      />
    </div>
  );
};
