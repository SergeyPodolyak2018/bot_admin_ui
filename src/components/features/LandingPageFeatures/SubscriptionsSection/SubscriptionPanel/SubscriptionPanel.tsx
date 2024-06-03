import { Button } from '../../Button/Button';
import { Button as TryItNowButton } from 'components/common';
import styles from './subscriptionPanel.module.scss';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationEnum } from 'navigation';

export const SubscriptionPanel: FC<{ type: 'basic' | 'pro' | 'enterprise' }> = ({ type }) => {
  const url = `url(/checkBoxIcon.svg)`;

  const navitage = useNavigate();
  const types = {
    basic: {
      title: 'Free Plan',
      price: '$0 to start',
      keys: ['Chatbot', 'Training Words', 'Queries Per Month', 'Chat History', 'Chat Customization'],
      description: 'Explore the product and power small, personal project',
      btn: 'TRY USE FOR FREE',
    },
    pro: {
      title: 'Pro Plan',
      price: 'Customize your plan',
      description: 'Run production applications with full functionality',
      keys: [
        'Chatbot',
        'Training Words',
        'Queries Per Month',
        'Chat History',
        'Chat Customization',
        'Website Loader',
        'Remove Powered By',
      ],
      btn: 'TALK TO US',
    },
    enterprise: {
      title: 'Enterprise Plan',
      price: 'Tailor your plan.',
      description: 'Run compliant production apps with full functionality, onbording and support',
      keys: [
        'Chatbot',
        'Training Words',
        'Queries Per Month',
        'Chat History',
        'Chat Customization',
        'Website Loader',
        'Remove Powered By',
        'API Access',
      ],
      btn: 'TALK TO US',
    },
  };

  return (
    <div className={`${styles.container} ${type === 'pro' ? styles.pro : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleHolder}>
          <p className={styles.title}>{types[type].title}</p>
          {type === 'basic' && <Button style={{ padding: '12px 20px', textWrap: 'nowrap' }} label={'7 Days Trial'} />}
        </div>
        <div className={styles.costLabel}>{types[type].price}</div>
      </div>

      <div className={styles.descLabel}>
        <span>{types[type].description}</span>
      </div>

      <div className={styles.benefitsContainer}>
        {types[type].keys.map((item) => (
          <div key={item} className={styles.benefit}>
            <div className={styles.iconHolder} style={{ backgroundImage: url }}></div>
            <p className={styles.benefitText}>{item}</p>
          </div>
        ))}
      </div>
      <div className={styles.buttonHolder}>
        <TryItNowButton
          label={types[type].btn}
          style={{ fontWeight: 700, textWrap: 'nowrap' }}
          onClick={() => {
            if (type === 'basic') {
              navitage(NavigationEnum.SIGN_UP);
            }
          }}
        />
      </div>
    </div>
  );
};
