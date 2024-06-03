import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { getCategorieById, getPromptById } from 'services/api';
import { getConfig, getEditTargetSelector, setShowEditWindow, useAppDispatch, useAppSelector } from 'store';

import { TCategore, TConfigCategory, TConfigPrompt, TPromtFields } from 'types';
import logger from 'utils/logger.ts';
import { CategoryForm, CreateBotForm, EditBot, PromtForm } from '../forms2';
import styles from './EditNode.module.scss';

export const EditNode = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState<TConfigPrompt | null>(null);

  const [category, setCategory] = useState<TConfigCategory | null>(null);

  const editTarget = useAppSelector(getEditTargetSelector);
  const config = useAppSelector(getConfig);

  const close = () => {
    dispatch(setShowEditWindow(false));
  };

  useEffect(() => {
    if (editTarget.type !== 'bot') {
      if (editTarget.type === 'category') {
        const targetCategory = config.categories.find((el) => el.id === editTarget.id);
        if (!targetCategory) return;
        setCategory(targetCategory);
        setLoading(false);
        // getCategorieById(editTarget.id)
        //   .then((resp) => {
        //     setCategory(resp.data);
        //     setLoading(false);
        //   })
        //   .catch((err) => logger.error(err));
      }
      if (editTarget.type === 'promt') {
        const targetPrompt = config.prompts.find((el) => el.id === editTarget.id);
        if (!targetPrompt) return;
        setPrompt(targetPrompt);
        setLoading(false);
        // getPromptById(editTarget.id)
        //   .then((resp) => {
        //     setPrompt(resp.data);
        //     setLoading(false);
        //   })
        //   .catch((err) => logger.error(err));
      }
    } else {
      setLoading(false);
    }
  }, [editTarget]);

  return (
    <div className={styles.wrapper} style={{ zIndex: 1000 }}>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <CircularProgress />
        </Box>
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          {!loading && editTarget.type === 'promt' && prompt && (
            <PromtForm data={prompt} close={close} loading={() => setLoading(true)} />
          )}
          {!loading && editTarget.type === 'category' && category && (
            <CategoryForm data={category} close={close} loading={() => setLoading(true)} />
          )}
          {!loading && editTarget.type === 'bot' && editTarget.action === 'create' && (
            <CreateBotForm
              data={{
                id: -1,
                name: '',
                organizationId: -1,
                greeting: '',
                language: 'en',
                useContext: false,
                useHistory: false,
                useRemarks: false,
                prompt: '',
              }}
              close={close}
            />
          )}
          {!loading && editTarget.type === 'bot' && editTarget.action === 'update' && <EditBot close={close} />}
        </div>
      )}
    </div>
  );
};
