import {
  AdvantagesSection,
  DemoCallSection,
  Footer,
  IntroSection,
  LandingHeader,
  SubscriptionsSection,
} from 'components/features';
import { enableLandingWidget } from 'config';
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { fetchUser, useAppDispatch } from 'store';
import { useWebPush } from 'utils/hooks';
import { useFingerprint } from 'utils/hooks/useFingerprint.ts';
import styles from './mainView.module.scss';
import { useLocation } from 'react-router-dom';

export const LandingPage = () => {
  const dispatch = useAppDispatch();
  const ref = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useFingerprint();
  useWebPush();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const setClasses = (el: any) => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (!isScrollable) {
        el.classList.remove('is-bottom-overflowing', 'is-top-overflowing');
        return;
      }
      const isScrolledToBottom = el.scrollHeight < el.clientHeight + el.scrollTop + 1;
      const isScrolledToTop = isScrolledToBottom ? false : el.scrollTop === 0;
      el.classList.toggle('is-bottom-overflowing', !isScrolledToBottom);
      el.classList.toggle('is-top-overflowing', !isScrolledToTop);
    };

    const el = contentRef.current;
    if (el) {
      setClasses(el);
      el.addEventListener('scroll', () => setClasses(el));
    }

    return () => {
      if (el) {
        el.removeEventListener('scroll', () => setClasses(el));
      }
    };
  }, []);

  const addWidget = (d: Document, w: Window & typeof globalThis) => {
    // @ts-expect-error resolveBotId not found in window object
    w.resolveBotId = 'b50add1f-a789-4911-bd12-d04034fee49b';
    const s = d.createElement('script');
    s.async = true;
    s.src = 'https://dev.BOT.ai/widget/chat.js';
    if (d.head) contentRef.current?.appendChild(s);
  };

  useEffect(() => {
    enableLandingWidget() && addWidget(document, window);
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <Helmet>
        <title>BOT.ai - Conversational Intelligence</title>
      </Helmet>
      <div id={'chatbotai'}></div>
      <LandingHeader parentRef={ref} />
      <div ref={contentRef} className={styles.content} id="content">
        <IntroSection parentRef={ref} />
        <AdvantagesSection />
        <DemoCallSection />
        <SubscriptionsSection />
        <Footer />
      </div>
    </div>
  );
};
