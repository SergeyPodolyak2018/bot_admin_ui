import styles from './subscription.module.scss';
import { SubscriptionPanel } from './SubscriptionPanel/SubscriptionPanel';

export const SubscriptionsSection = () => {
  // const [, setSelectedTab] = useState(1);

  // const handleTabClick = (tabNumber: number) => {
  //   setSelectedTab(tabNumber);
  // };
  return (
    <section className={`${styles.section} stop-point`} id={'priceSectionContainer'}>
      <div className={styles.mainContainer}>
        <h5 className={styles.section__title}>Flexible & Cost-Effective Pricing</h5>
        <div className={styles.container}>
          <div className={styles.content}>
            <SubscriptionPanel type={'basic'} />
            <SubscriptionPanel type={'pro'} />
            <SubscriptionPanel type={'enterprise'} />
          </div>
        </div>
      </div>
    </section>
  );
};
