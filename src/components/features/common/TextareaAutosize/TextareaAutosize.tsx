import { styled } from '@mui/material/styles';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize/TextareaAutosize';

export const TextareaAutosize = styled(BaseTextareaAutosize)(
  () => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;

  &:focus {
    outline: none;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);
