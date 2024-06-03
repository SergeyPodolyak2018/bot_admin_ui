import { useTranslation } from 'react-i18next';
import Vector4 from '../../../../assets/svg/landing/Vector 4.svg';
import Vector5 from '../../../../assets/svg/landing/Vector 5.svg';
import Vector6 from '../../../../assets/svg/landing/Vector 6.svg';
import Vector7 from '../../../../assets/svg/landing/Vector 7.svg';
import Vector8 from '../../../../assets/svg/landing/Vector 8.svg';
import styles from './advantages.module.scss';

export const AdvantagesSection = () => {
  const { t } = useTranslation();
  return (
    <section className={`${styles.holder} stop-point`} id={'section2'}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.imagesContainer}>
            <img className={styles.image1} src={Vector4} alt="Content"></img>
            <img className={styles.image2} src={Vector5} alt="Content"></img>
            <img className={styles.image3} src={Vector6} alt="Content"></img>
            <img className={styles.image4} src={Vector7} alt="Content"></img>
            <img className={styles.image5} src={Vector8} alt="Content"></img>
          </div>
        </div>
        <div className={styles.textContainer}>
          <p className={styles.title}>{t('landingPageFeatures.AdvantagesSection.title')}</p>
          <p className={styles.text}>{t('landingPageFeatures.AdvantagesSection.text')}</p>
        </div>
      </div>
    </section>
  );
};
