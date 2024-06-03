export const isCursorOverSpanElement = (x: number, y: number): boolean => {
  const elemBelow = document.elementFromPoint(x, y);
  return elemBelow?.tagName.toLowerCase() === 'span';
};

export const insertElementAfterSpan = (newElement: HTMLElement, x: number, y: number) => {
  const spanElement = document.elementFromPoint(x, y) as HTMLElement;
  const parent = spanElement.parentNode as HTMLElement;
  parent.insertBefore(newElement, spanElement.nextSibling);
};

export const getCaretPosition = (x: number, y: number): number => {
  const range = document.caretRangeFromPoint(x, y);
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const textNode = selection.focusNode;
    if (textNode && textNode.nodeType === Node.TEXT_NODE && range) {
      const offset = range.startOffset;
      return offset;
    }
  }
  return 0;
};

export const insertElementAtCaret = (element: HTMLElement, newElement: HTMLElement, position: number) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const textNode = selection.focusNode;
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent || '';
      const beforeText = text.slice(0, position);
      const afterText = text.slice(position);

      const isSpanElement = (node: Node | null): boolean => {
        return !!node && node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName.toLowerCase() === 'span';
      };

      const wrapTextInSpanIfNeeded = (text: string): Node => {
        const span = document.createElement('span');
        span.textContent = text;
        return span;
      };

      const wrappedBeforeTextNode = wrapTextInSpanIfNeeded(beforeText);
      const wrappedAfterTextNode = wrapTextInSpanIfNeeded(afterText);

      if (position === 0) {
        element.insertBefore(newElement, textNode);
      } else if (position === text.length) {
        const newLineElement = document.createElement('br');
        element.appendChild(newLineElement);
        element.appendChild(newElement);
      } else {
        const parentSpan = textNode.parentNode as HTMLElement;
        parentSpan.insertBefore(newElement, textNode.nextSibling);
      }

      if (position !== text.length) {
        const parentSpan = textNode.parentNode as HTMLElement;
        parentSpan.insertBefore(wrappedAfterTextNode, newElement.nextSibling);
      }

      if (position !== 0) {
        const parentSpan = textNode.parentNode as HTMLElement;
        parentSpan.insertBefore(wrappedBeforeTextNode, newElement);
      }

      if (element.tagName.toLowerCase() === 'div') {
        const parentSpan = textNode.parentNode as HTMLElement;
        parentSpan.removeChild(textNode);
      }

      if (isSpanElement(element)) {
        const parentSpan = element.parentNode as HTMLElement;
        parentSpan.removeChild(element);
      }

      selection.removeAllRanges();
    }
  }
};

export const setCaretPosition = (element: HTMLDivElement, position: number) => {
  const range = document.createRange();
  const selection = window.getSelection();
  if (selection) {
    let offset = 0;
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node as Text).textContent || '';
        if (offset + text.length >= position) {
          range.setStart(node, position - offset);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }
        offset += text.length;
      } else {
        offset += 1;
      }
    });
  }
};
