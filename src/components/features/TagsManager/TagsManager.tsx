import { ITag, TagsMap } from 'utils/tagsMap';
import { Tag } from '../Tags/Tag';
import styles from './tagsManager.module.scss';

interface IOptionItem {
  viewLabel: string;
  isActive: boolean;
  label: string;
}

interface ITagsManager {
  activeCategory: string;
  onDragTagCallback: (tag: ITag | undefined) => void;
  options: IOptionItem[];
}
export const TagsManager = (props: ITagsManager) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    props.onDragTagCallback(TagsMap.find((x) => x.label === target.dataset.set));
    e.dataTransfer.setData('text/plain', target.outerHTML);
  };

  return (
    <div className={styles.optionsWrapper}>
      {TagsMap.map((tag: ITag, index) => (
        <Tag
          key={index}
          tag={tag}
          handleDragStart={handleDragStart}
          isActive={
            props.options.find(
              (option) => option.viewLabel === (tag.useCategoryName ? props.activeCategory : tag.viewLabel),
            )?.isActive
          }
          label={tag.useCategoryName ? props.activeCategory : tag.viewLabel}
        />
      ))}
    </div>
  );
};
