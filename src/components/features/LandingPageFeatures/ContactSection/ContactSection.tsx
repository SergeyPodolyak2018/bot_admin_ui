import { Button as TryItNowButton } from 'components/common';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { TopicSection } from '../TopicSection/TopicSection';
import styles from './contactSection.module.scss';

export const ContactSection = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container} id={'contactsSectionContainer'}>
      <div className={styles.content}>
        <TopicSection
          subTitle={t('landingPageFeatures.ContactSection.excitingAI')}
          title={t('landingPageFeatures.ContactSection.experiencesAwait')}
        />
        <div className={styles.buttonsHolder}>
          <Button
            style={{
              width: '281px',
              height: '58px',
              fontSize: '18px',
              lineHeight: '22px',
              fontWeight: '500',
            }}
            label={t('landingPageFeatures.ContactSection.email')}
          />
          <TryItNowButton
            style={{
              width: '281px',
              height: '58px',
              fontSize: '18px',
              lineHeight: '22px',
              fontWeight: '500',
            }}
            label={t('landingPageFeatures.ContactSection.letsResolvai')}
          />
        </div>
      </div>
    </div>
  );
};
