import { Loader } from 'components/common';
import { useState } from 'react';
import { CreateBotForm } from './Configuration/index.ts';
import styles from './createBot.module.scss';
// import { useAppSelector } from 'store/store.hooks.ts';
// import { selectOrganisationsState } from 'store/index.ts';

export const CreateBot = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      {loading && <Loader type={'full-page'} />}
      <div className={styles.contentContainer}>
        <div className={styles.template_holder}>
          <CreateBotForm setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
};
