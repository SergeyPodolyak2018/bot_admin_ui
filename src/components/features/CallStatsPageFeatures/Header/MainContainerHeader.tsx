import { Menu, MenuItem, styled } from '@mui/material';
import RefreshIcon from 'assets/svg/retryIcon.svg';
import { Button, Checkbox } from 'components/common';

import { CustomDropDownIcon } from 'components/common/CustomDropDownIcon/CustomDropDownIcon';
import { ConfirmModalUniversal } from 'components/features/common';
import { FC, useState } from 'react';
import { setFilters, useAppDispatch } from 'store';
import { Interaction } from 'types';

import { getSentiment } from 'utils/sentimentsUtils';
import FilterIcon from '../../../../assets/svg/filter.svg';
import DownloadSvg from '../../../../assets/svg/import.svg';
import styles from './header.module.scss';
import { IconButton } from './IconButton/IconButton';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'white',
    cursor: 'default',
  },
  '&:focus': {
    backgroundColor: 'white',
  },
}));

interface IMainContainerHeader {
  onRefresh: () => void;
  onDownload: () => void;
  onStartConversation: () => void;
  interaction: Interaction;
  isUser: boolean;
}

export const MainContainerHeader: FC<IMainContainerHeader> = ({
  onRefresh,
  onDownload,
  onStartConversation,
  interaction,
  isUser,
}) => {
  const [filterSentimentValues, setFilterSentiments] = useState(['positive', 'neutral', 'negative', '']);
  const [filterSentimentValuesStatic, setFilterSentimentsStatic] = useState(['positive', 'neutral', 'negative']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useAppDispatch();
  const filter = (filterValue: string) => {
    let updatedSentiments = [...filterSentimentValues];

    if (filterSentimentValues.includes(filterValue)) {
      updatedSentiments = updatedSentiments.filter((x) => x !== filterValue);
    } else {
      updatedSentiments.push(filterValue);
    }
    dispatch(setFilters(updatedSentiments));
    setFilterSentiments(updatedSentiments);
  };
  return (
    <div className={styles.container}>
      {isConfirmOpen && (
        <ConfirmModalUniversal
          title={'Get In Conversation'}
          cancel={() => setIsConfirmOpen(false)}
          confirm={onStartConversation}>
          The AI Agent will no longer be able to participate in the conversation.
        </ConfirmModalUniversal>
      )}
      <>
        <div className={styles.imgHolder} onClick={handleClick}>
          <div className={styles.filterButton}>
            <img src={FilterIcon} alt="Icon" />
            <span>Sentiment</span>
            <div
              className={styles.dropDownIcon}
              style={{
                transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease-in-out',
              }}>
              <CustomDropDownIcon defaultDD />
            </div>
          </div>
        </div>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
            sx: { padding: 0 },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              boxShadow: '0px 0px 3px 0px #0655F340',
            },
          }}
          PaperProps={{
            style: {
              marginTop: '4px',
              maxHeight: 45 * 4.5,
              width: '171px',
              borderRadius: '10px',
              border: '1px solid #9FA6B377',
            },
          }}>
          {filterSentimentValuesStatic.map((item, index) => (
            <StyledMenuItem
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                filter(item);
              }}
              style={{
                padding: '7px',
                borderBottom: '1px solid #9FA6B377',
              }}>
              <div
                className={styles.menuItemHolder}
                style={{ padding: '4px 7px 4px 7px' }}
                onMouseEnter={(e) => e.currentTarget.classList.add(styles.hoverEffect)}
                onMouseLeave={(e) => e.currentTarget.classList.remove(styles.hoverEffect)}>
                <div className={styles.menuItem}>
                  <Checkbox
                    style={{ padding: 0, width: '20px', height: '20px' }}
                    checked={filterSentimentValues.includes(item)}
                  />

                  <span style={{ fontSize: '16px' }} className={styles.label}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                  <img src={getSentiment(item)} alt={'icon'} />
                </div>
              </div>
            </StyledMenuItem>
          ))}
        </Menu>
      </>
      <div className={styles.btns}>
        <div className={styles.buttonHolder}>
          <IconButton icon={DownloadSvg} onClick={onDownload} text={'Download'} />
          <IconButton disable={isUser} icon={RefreshIcon} onClick={onRefresh} text={'Refresh'} />
        </div>
        {interaction.type === 'text_chat' && !interaction.done && (
          <Button
            disabled={isUser}
            onClick={() => setIsConfirmOpen(true)}
            classNames={styles.conversationBtn}
            label={'Get In Conversation'}
          />
        )}
      </div>
    </div>
  );
};
