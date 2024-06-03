import type { RealTimeVADOptions } from '@ricky0123/vad-web';
import { defaultRealTimeVADOptions, MicVAD } from '@ricky0123/vad-web';
import { useCallback, useEffect, useMemo, useState } from 'react';
import logger from 'utils/logger.ts';

interface ReactOptions {
  initOnLoad: boolean;
  startOnReady: boolean;
  userSpeakingThreshold: number;
}

export type ReactRealTimeVADOptions = RealTimeVADOptions & ReactOptions;

const defaultReactOptions: ReactOptions = {
  initOnLoad: true,
  startOnReady: true,
  userSpeakingThreshold: 0.6,
};

export const defaultReactRealTimeVADOptions = {
  ...defaultRealTimeVADOptions,
  ...defaultReactOptions,
};

const vadOptionKeys = Object.keys(defaultRealTimeVADOptions);
const reactOptionKeys = Object.keys(defaultReactOptions);

const _pick = (obj: any, keys: string[]) => {
  return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
};

export default (inputOptions: Partial<ReactRealTimeVADOptions>) => {
  const [userSpeaking, setUserSpeaking] = useState(false);
  const { reactOptions, vadOptions } = useMemo(() => {
    const defaultOptions = { ...defaultReactRealTimeVADOptions, ...inputOptions };
    const reactOptions = _pick(defaultOptions, reactOptionKeys) as ReactOptions;
    const vadOptions = _pick(defaultOptions, vadOptionKeys) as RealTimeVADOptions;
    vadOptions.onFrameProcessed = ({ isSpeech }) => setUserSpeaking(isSpeech > reactOptions.userSpeakingThreshold);
    return { reactOptions, vadOptions };
  }, [inputOptions]);

  const [vad, setVAD] = useState<MicVAD | undefined>();
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState<false | string>(false);
  const [listening, setListening] = useState(false);

  const ready = useMemo(() => {
    // Create a helper for resolving the readiness state
    return Boolean(vad && !loading && !errored);
  }, [vad, loading, errored]);

  const terminate = useCallback(() => {
    if (!vad) return console.warn('VAD: Cannot terminate while uninstatiated');
    vad.destroy(); // Immediately destroy voice detection & associated streams
    setVAD(undefined); // Clear the vad object state
    setLoading(false); // Indicate that no loaidng operation is occuring
    setErrored(false); // Unset any errors that may have occured
    setListening(false); // Indicate that listening has stopped
    logger.debug('VAD: terminated');
  }, [vad]);

  const initialize = useCallback(async () => {
    if (loading) return console.warn('VAD: Cannot initialize while loading');
    if (errored) return console.warn('VAD: Cannot initialize while in error state');
    if (ready) terminate(); // Kill any previously initialized vad
    setLoading(true); // Indicate that the vad subsystem is loading
    try {
      setVAD(await MicVAD.new(vadOptions));
    } catch (e) {
      // Initialize a new vad object
      setErrored(((e as Error).message || e) as string);
    } finally {
      // report any errors
      setLoading(false);
    } // Then remove the loading flag
  }, [errored, loading, ready, terminate, vadOptions]);

  const start = useCallback(() => {
    if (!ready) return console.warn('VAD: Cannot start until ready');
    setListening(true); // Indicate that listening has started
    vad?.start(); // And start voice detection
  }, [ready, vad]);

  const pause = useCallback(() => {
    if (!ready) return console.warn('VAD: Cannot pause until ready');
    setListening(false); // Indicate that listening has stopped
    vad?.pause(); // And pause voice detection
  }, [ready, vad]);

  const toggle = useCallback(() => {
    // Create a helper for toggling voice detection on/off
    return listening ? pause() : start();
  }, [listening, pause, start]);

  useEffect(() => {
    if (reactOptions.initOnLoad) initialize();
  }, [reactOptions.initOnLoad]);

  useEffect(() => {
    if (ready && reactOptions.startOnReady) start();
  }, [ready]);

  return {
    loading,
    errored,
    ready,
    listening,
    userSpeaking,
    initialize,
    terminate,
    start,
    pause,
    toggle,
  };
};
