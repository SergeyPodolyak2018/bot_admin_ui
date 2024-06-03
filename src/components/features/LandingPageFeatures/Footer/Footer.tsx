import { useTranslation } from 'react-i18next';
import phone from '../../../../assets/svg/landing/call.svg';
import facebook from '../../../../assets/svg/landing/FacebookLogo.svg';
import linked from '../../../../assets/svg/landing/LinkedinLogo.svg';
import point from '../../../../assets/svg/landing/location.svg';
import mail from '../../../../assets/svg/landing/postIcon.svg';
import whatsapp from '../../../../assets/svg/landing/WhatsappLogo.svg';
import styles from './footer.module.scss';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={`${styles.footer} stop-point`}>
      <div className={styles.footerContacts}>
        <div className={styles.contacts}>
          <div className={styles.description}>
            <span className={styles.title}>{t('header.title')}</span>
            <p className={styles.desc}>
              With BOT.ai, crafting your personalized AI-driven assistant is easy and fast. Tailor your chatbot,
              seamlessly integrate data, and benefit from a smart, personalized assistant experience.
            </p>
          </div>
        </div>
        <div className={styles.contacts}>
          <div className={styles.contactsContainer}>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <img className={styles.icon} src={point} alt="Content" />
                <button>1195 Awalt Dr, Mountain View, CA 94040, United States</button>
              </div>
              <div className={styles.infoItem}>
                <img className={styles.icon} src={phone} alt="Content" />
                <a href="tel:+15304365280">+1 530 436 5280</a>
              </div>
              <div className={styles.infoItem}>
                <img className={styles.icon} src={mail} alt="Content" />
                <a href="mailto:resolveai@etring.com">contact@BOT.ai</a>
              </div>
            </div>
            <div className={styles.socials}>
              <img className={styles.icon} src={whatsapp} alt="Content" />
              <img className={styles.icon} src={linked} alt="Content" />
              <img className={styles.icon} src={facebook} alt="Content" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.linkList}>
          <span className={styles.linkList}>© 2024 BOT.ai</span>
        </div>
        <div className={styles.linkList}>
          <a href="/ " className={styles.linkList}>
            Terms and conditions
          </a>
          <a href="/" className={styles.linkList}>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};
