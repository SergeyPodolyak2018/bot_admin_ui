import { Loader } from 'components/common';
import { BotList, ConfirmDeleteBot, EditNode } from 'components/features';
import { useEffect, useState } from 'react';
import { removeBot } from 'services/api/index.ts';
import {
  addNotification,
  fetchBots,
  fetchOrganisations,
  getShowEditWindowSelector,
  setShowEditWindow,
  useAppDispatch,
  useAppSelector,
} from 'store';

export const BotsPage = () => {
  const dispatch = useAppDispatch();
  const showEditWindow = useAppSelector(getShowEditWindowSelector);

  const [, setEditBot] = useState<number | null>(null);
  const [deleteModalIsOpen, setDeleteModalState] = useState(false);
  const [deleteBot, setDeleteBot] = useState({
    isOwner: false,
    confirm: false,
    bot: -1,
    botName: '',
  });

  useEffect(() => {
    dispatch(fetchOrganisations());
    dispatch(fetchBots());
    dispatch(setShowEditWindow(false));
  }, []);

  const applyDelete = () => {
    if (deleteBot.isOwner) {
      setDeleteModalState(true);
      removeBot(deleteBot.bot)
        .then(() => {
          dispatch(fetchBots());
          dispatch(addNotification({ message: 'Bot successfully deleted', type: 'success', title: 'Success' }));
        })
        .catch(() => {
          dispatch(addNotification({ message: 'Delete bot error', type: 'error', title: 'Error' }));
        })
        .finally(() => {
          setDeleteModalState(false);
        });
      setDeleteBot({ confirm: false, bot: -1, isOwner: false, botName: '' });
    } else {
      dispatch(
        addNotification({
          message: 'Only the owner has permission to remove the bot',
          type: 'error',
          title: 'AI Agents',
        }),
      );
    }
  };
  return (
    <>
      {deleteModalIsOpen && <Loader type={'full-page'} />}
      {!showEditWindow && deleteBot.confirm && (
        <ConfirmDeleteBot
          onApply={applyDelete}
          onClose={() => setDeleteBot({ confirm: false, bot: -1, isOwner: false, botName: '' })}
          botName={deleteBot.botName}
        />
      )}
      {showEditWindow && <EditNode />}
      <BotList
        onClickEditBot={(id) => setEditBot(id)}
        onClickDeleteBot={(id, isOwner, name) =>
          setDeleteBot({ bot: id, confirm: true, isOwner: isOwner, botName: name })
        }
      />
    </>
  );
};
