import { Button as TryItNowButton } from 'components/common';
import { useTranslation } from 'react-i18next';
import robotHand from '../../../../assets/svg/landing/Hand.svg';
import styles from './introSection.module.scss';

interface IIntroSectionProps {
  parentRef: any;
}
export const IntroSection = (props: IIntroSectionProps) => {
  const { t } = useTranslation();
  const scrollToRef = (ref: any) => {
    const top =
      ref.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2 - ref.offsetHeight / 2) - 60;
    props.parentRef.current.scrollTo({ top, behavior: 'smooth' });
  };

  const handleButtonClick = () => {
    const containerRef = document.getElementById('demoSectionContainer');
    scrollToRef(containerRef);
  };
  return (
    <section className={`${styles.container} stop-point`}>
      <img className={styles.firstHandContainer} src={robotHand} alt={'hand'}></img>
      <img className={styles.secondHandContainer} src={robotHand} alt={'hand'}></img>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.title}>BOT CX</div>
          <p className={styles.text}>{t('landingPageFeatures.IntroductionSection.text')}</p>
          <TryItNowButton
            style={{ fontSize: '18px', fontWeight: '600' }}
            label={t('landingPageFeatures.IntroductionSection.tyItNow')}
            onClick={handleButtonClick}
          />
        </div>
      </div>
    </section>
  );
};
