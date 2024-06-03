import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box } from '@mui/material';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import classnames from 'classnames/bind';
import { Button as TryItNowButton } from 'components/common';
import { InputWithMarkedWordsDrag } from 'components/common/InputWithMarkedWordsDrag/InputWithMarkedWordsDrag.tsx';
import { IOptionItem } from 'components/features/TemplateBotConfigFeature/KnowldgeBase/KnowldgeBase.tsx';
import { useEffect, useRef, useState } from 'react';
import { putCategore, putPromptById } from 'services/api';
import {
  activeBotSelector,
  fetchCategories,
  setShowEditWindow,
  updateCategory,
  updatePrompt,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { fieldsSerializer, textPreprocessor, textPreprocessorBrackeLines } from 'utils/botUtils';
import logger from 'utils/logger.ts';
import { ITag, TagsMap } from 'utils/tagsMap.ts';
import { TCategore, TPromtFields } from '../../../../types/index.ts';

import { Button as CustomButton } from '../../LandingPageFeatures/Button/Button.tsx';
import { VisuallyHiddenInput } from '../forms/index.ts';
import { categoryFields, inputStyle, promtFields } from './const.ts';
import styles from './Forms.module.scss';
// type TFormProps = {
//   id: number;
// };
const cx = classnames.bind(styles); // <-- explicitly bind your styles

export const FieldsGenerator = (data: {
  name: string;
  type: string;
  value: any;
  label: string;
  skip?: boolean;
  multiline?: boolean;
  rows?: number;
  preprocessor?: boolean;
  fileHandler?: any;
  fileName?: string;
  isError?: boolean;
  hidden?: boolean;
  resetSelectedFile?: () => void;
  key: string | number;
}) => {
  if (!data.skip) {
    switch (data.type) {
      case 'boolean':
        return (
          <FormControlLabel
            key={data.key}
            style={{ ...inputStyle, display: data.hidden ? 'none' : 'block' }}
            label={data.label}
            control={<Checkbox name={data.name} defaultChecked={data.value} />}
          />
        );
      case 'file':
        return (
          <div
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            key={data.key}>
            {data.fileName ? (
              <CloseIcon
                onClick={data?.resetSelectedFile}
                sx={{ mt: '25px', width: '25px', height: '25px', cursor: 'pointer' }}
              />
            ) : (
              <Box sx={{ width: '25px', heigth: '25px' }}></Box>
            )}

            <TextField
              key="fileName"
              id="fileName"
              disabled
              name={data.name}
              label={data.label}
              variant="standard"
              style={{ ...inputStyle, width: '65%', color: '#000' }}
              value={data.fileName}
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              style={{
                backgroundColor: '#ffffff',
                color: '#1f1f1f',
                border: '1px solid #1f1f1f',
                fontSize: '12px',
                width: '40%',
              }}
              startIcon={<CloudUploadIcon />}>
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="file"
                required={false}
                accept=".json"
                onChange={data.fileHandler}
              />
            </Button>
          </div>
        );
      default:
        return (
          <TextField
            error={data.isError}
            key={data.key}
            id={data.name}
            name={data.name}
            label={data.label}
            variant="standard"
            style={inputStyle}
            defaultValue={data.value}
            type={data.type}
            inputProps={{
              ...(data.type === 'number' && {
                step: 'any',
              }),
            }}
            multiline={data.multiline}
            rows={data.rows || 1}
          />
        );
    }
  }
};

// export const FileForm = ({ id }: TFormProps) => {
//   const [file, setFile] = useState<TPromtFields | null>(null);

//   const className = cx({
//     [styles.tipicalForm]: true,
//   });

//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const entries = Object.fromEntries(formData);

//     console.log(formData);
//   }

//   return (
//     <div className={className}>
//       <form onSubmit={handleSubmit}>
//         <div className={styles.header}>Update File</div>
//         <div className={styles.body}>
//           <TextField
//             id="fileName"
//             name="fileName"
//             label="File name"
//             variant="standard"
//             style={{ width: '50%' }}
//           />
//           <Button
//             component="label"
//             role={undefined}
//             variant="contained"
//             tabIndex={-1}
//             startIcon={<CloudUploadIcon />}
//           >
//             Upload file
//             <VisuallyHiddenInput type="file" name="file" />
//           </Button>
//         </div>
//         <div className={styles.footer}>
//           <Button variant="outlined" onClick={close}>
//             Close
//           </Button>
//           <Button
//             variant="contained"
//             type="submit"
//             endIcon={<SendIcon />}
//             style={{ marginLeft: '20px' }}
//           >
//             Send
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

export const CategoryForm = (props: { data: TCategore; close: () => void; loading: () => void }) => {
  const dispatch = useAppDispatch();
  const activeBot = useAppSelector(activeBotSelector);
  const className = cx({
    [styles.tipicalForm]: true,
    [styles.upper]: true,
  });
  const classBody = cx({
    [styles.body]: true,
    [styles.big]: true,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entries = Object.fromEntries(formData);

    const preparedData = fieldsSerializer(categoryFields, entries) as Partial<TCategore>;
    props.loading();

    try {
      //await putCategore(props.data.id, preparedData);
      dispatch(updateCategory({ id: props.data.id, data: preparedData }));
      dispatch(setShowEditWindow(false));
    } catch (err) {
      logger.error(err);
    }
    props.loading();
    dispatch(setShowEditWindow(false));
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>Update Category</div>
        <div className={classBody}>
          {categoryFields.map((el) => {
            return FieldsGenerator({
              key: el.name,
              ...el,
              value: props.data[el.name as keyof TCategore],
            });
          })}
        </div>
        <div className={styles.footer}>
          <CustomButton onClick={props.close} label={'Close'} style={{ height: '48px', width: '130px' }} />
          <TryItNowButton label={'Send'} style={{ height: '48px', marginLeft: '20px', width: '130px' }} type="submit" />
        </div>
      </form>
    </div>
  );
};

export const PromtForm = (props: { data: TPromtFields; close: () => void; loading: () => void }) => {
  const dispatch = useAppDispatch();
  const activeBot = useAppSelector(activeBotSelector);
  const inputRef = useRef<HTMLDivElement>(null);
  const className = cx({
    [styles.tipicalForm]: true,
  });
  const [receivedTags] = useState<ITag[]>();

  useEffect(() => {
    setOptions(() =>
      TagsMap.map((tag) => ({
        viewLabel: tag.useCategoryName ? props.data.name : tag.viewLabel,
        isActive: receivedTags?.find((x) => x.label === tag.label) ? false : true,
        label: tag.label,
      })),
    );
  }, [receivedTags]);

  const [, setOptions] = useState<IOptionItem[]>(
    TagsMap.map((tag) => ({
      viewLabel: tag.useCategoryName ? props.data.name : tag.viewLabel,
      isActive: true,
      label: tag.label,
    })),
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const someElements = document.getElementsByClassName('tagify__input');
    const parser = new DOMParser();
    const doc = parser.parseFromString((someElements[0] as HTMLSpanElement).innerHTML, 'text/html');
    Array.from(someElements).forEach((element) => {
      const tags = doc.querySelectorAll('tag');
      // console.log(tags, doc, someElements);
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
    });
    formData.set('text', doc.body.innerText);

    const entries = Object.fromEntries(formData);
    const preparedData = fieldsSerializer(promtFields, entries) as Partial<TPromtFields>;
    props.loading();
    try {
      console.log(props.data.id, preparedData);
      // await putPromptById(props.data.id, preparedData);
      dispatch(updatePrompt({ id: props.data.id, data: preparedData }));
      dispatch(setShowEditWindow(false));
    } catch (err) {
      logger.error(err);
    }
  };
  const formatedText = (text: string) => {
    const updatedText = text.replace(/%([^%]+)%/g, (match) => {
      const tag = TagsMap.find((x) => x.label === match);
      if (tag) {
        const replacement = tag.useCategoryName ? props.data.name : tag.viewLabel;
        return `[[{"value":${JSON.stringify(replacement)}}]]`;
      }

      return match;
    });
    return `${updatedText}`;
  };
  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>Update Prompt</div>
        <div className={styles.body}>
          {promtFields.map((el, index) => {
            return FieldsGenerator({
              ...el,
              key: index,
              value: props.data[el.name as keyof TPromtFields],
            });
          })}
          {/* <TagsManager activeCategory={props.data.name} onDragTagCallback={setDraggableTag} options={options} /> */}
          <InputWithMarkedWordsDrag
            reference={inputRef}
            text={formatedText(props.data.text)}
            lable={'Text'}
            preprocessors={[textPreprocessor, textPreprocessorBrackeLines]}
            // style={{ height: '500px' }}
            activeCategory={undefined}
            className={styles.input}
            activeCategoryName={props.data.name}
            wrapperClassName={styles.input}
          />
        </div>
        <div className={styles.footer}>
          <CustomButton onClick={props.close} label={'Close'} style={{ height: '48px', width: '130px' }} />
          <TryItNowButton label={'Send'} style={{ height: '48px', marginLeft: '20px', width: '130px' }} type="submit" />
        </div>
      </form>
    </div>
  );
};
