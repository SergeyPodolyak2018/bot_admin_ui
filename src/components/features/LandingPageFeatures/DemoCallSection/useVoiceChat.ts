import { Howl, Howler } from 'howler';
import { useEffect, useRef, useState } from 'react';
import useStateRef from 'react-usestateref';
import RecordRTC from 'recordrtc';
import { DEMO_VOICE_BOT } from 'services';
import { selectDevice, selectUser, useAppSelector } from 'store';
import { useSocket } from 'utils/hooks';
import logger from 'utils/logger.ts';
import { v4 as uuidv4 } from 'uuid';

interface IMedia {
  is_greeting: boolean;
  payload: string;
}

export type UseVoiceChatArgs = {
  botId: number | string;
  onCallStop?: () => void;
};
export const useVoiceChat = ({ botId, onCallStop }: UseVoiceChatArgs) => {
  const user = useAppSelector(selectUser);
  const device = useAppSelector(selectDevice);

  const [, setAudioContext, audioContextRef] = useStateRef<AudioContext | null>(null);
  const [, setMarks, marksQueueRef] = useStateRef<Array<string>>([]);
  const [, setChatIdRef, chatIdRef] = useStateRef<string>('');
  const [, setCurrentAudioPlayer, currentAudioPlayerRef] = useStateRef<Howl>();
  const [, setRecordAudio, recordAudioRef] = useStateRef<RecordRTC | null>(null);
  const [, setBotWaveformData, botWaveformDataRef] = useStateRef<Uint8Array | null>(null);
  const [, setAudioQueue, audioQueueRef] = useStateRef<Array<IMedia>>([]);
  const [, setIsPlaying, isPlayingRef] = useStateRef<boolean>(false);
  const [, setIsCalling, isCallingRef] = useStateRef<boolean>(false);
  const [, setIsConnecting, isConnecting] = useStateRef<boolean>(false);
  // const [, , isUserTalkingRef] = useStateRef<boolean>(false);
  const [statuses, setStatuses] = useState<Record<string, any> | null>(null);
  const [, setIsGreetingPlayed, isGreetingPlayedRef] = useStateRef(false);

  const {
    socketRef: voiceSocketRef,
    connectSocket,
    wsSend,
  } = useSocket({
    url: DEMO_VOICE_BOT,
    initOnLoad: false,
    onClose: () => {
      logger.debug('WebSocket connection closed');
      stopRecording();
      onCallStop && onCallStop();
    },
    onOpen: () => {
      audioStop();
      setIsCalling(true);
      try {
        startRecording();
      } catch (e) {
        logger.error('Error: ', e);
      }
      logger.debug(`WebSocket connection to ${DEMO_VOICE_BOT} open`);

      const chatId = uuidv4();
      setChatIdRef(chatId);
    },
    onError: () => {
      logger.error(`Error connection`);
      stopRecording();
    },
    onConnect: () => {
      logger.debug(`WebSocket connected to ${DEMO_VOICE_BOT}`);
    },
    onMessage: (event: any) => {
      if (!voiceSocketRef.current) return;
      const message = JSON.parse(event.data);

      if (message.event === 'error') {
        logger.error(`Error connection: `, message);
        setBotWaveformData(null);
        setIsConnecting(false);
      }
      if (message.event === 'status') {
        if (isCallingRef.current) {
          setStatuses(message.status);
        }
      }
      if (message.event === 'media') {
        logger.debug('got media');
        if (isConnecting.current === true) setIsConnecting(false);
        const mediaData = message.media;
        if (isCallingRef.current) {
          setAudioQueue((prevAudioQueue) => [...prevAudioQueue, mediaData]);
        }
        // console.log('Audio received', audioQueueRef.current.length);
      }
      if (message.event === 'mark') {
        logger.debug('got mark', message.mark.name);
        setMarks((prevMarks) => [...prevMarks, message.mark.name]);
      }
      if (message.event === 'clear') {
        marksQueueRef.current.map((mark) => sendWebSocketRequest(voiceSocketRef, chatIdRef, 'mark', { name: mark }));
        setMarks([]);
        setAudioQueue([]);
        setBotWaveformData(null);
        currentAudioPlayerRef.current?.pause();
        setIsPlaying(false);
      }
    },
  });
  const sendWebSocketRequest = (socketRef: any, chatIdRef: any, event: string, data: any) => {
    wsSend({
      event,
      chat_id: chatIdRef.current,
      userId: user?.id,
      [event]: data,
    });
  };

  // record user voice
  const streamRef = useRef<MediaStream>();
  const readerRef = useRef<any>(new FileReader());

  const startRecording = () => {
    setStatuses({});
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((stream) => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        streamRef.current = stream;
        if (!audioContextRef.current) {
          const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          setAudioContext(newAudioContext);
        }

        voiceSocketRef.current?.send(
          JSON.stringify({
            event: 'start',
            chat_id: chatIdRef.current,
            userId: user?.id,
            start: { bot_id: botId },
            device,
          }),
        );
        const sendData = (blob: Blob) => {
          const reader = readerRef.current;
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const buffer = reader.result as string;
            // console.log(buffer.replace('data:audio/wav;base64,', ''));
            isGreetingPlayedRef.current &&
              sendWebSocketRequest(voiceSocketRef, chatIdRef, 'media', {
                payload: buffer,
              });
          };
        };

        const recordRTC = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          // eslint-disable-next-line import/no-named-as-default-member
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          timeSlice: 100,
          disableLogs: false,
          desiredSampRate: 16000,
          ondataavailable: (blob) => {
            if (voiceSocketRef.current && !isConnecting.current) {
              sendData(blob);
            }
            // recordRTC.clearRecordedData();
          },
        });

        setRecordAudio(recordRTC);
        recordRTC.startRecording();
      })
      .catch((error) => {
        logger.error('Error get metadata', error);
      });
  };

  // play bot answer
  const animationFrameId = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const playAudio = () => {
    logger.debug(`AudioQueue: ${audioQueueRef.current.length}`);

    if (audioContextRef.current && audioQueueRef.current.length > 0) {
      logger.debug('playAudio', marksQueueRef.current[0]);
      setIsPlaying(true);

      const audioUrl = `data:audio/mpeg;base64,${audioQueueRef.current[0].payload}`;
      const audio = new Howl({
        src: audioUrl,
        rate: 1,
        // html5: true,
        onend: () => {
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
          logger.debug('audio ended', marksQueueRef.current[0]);
          if (
            !isGreetingPlayedRef.current &&
            audioQueueRef.current[0]?.is_greeting &&
            audioQueueRef.current.length === 1
          ) {
            setIsGreetingPlayed(true);
          }
          setIsPlaying(false);

          if (marksQueueRef.current[0]) {
            logger.debug('done play audio, send mark:', marksQueueRef.current[0]);
            sendWebSocketRequest(voiceSocketRef, chatIdRef, 'mark', { name: marksQueueRef.current[0] });
          }
          setMarks((prevQueue) => prevQueue.slice(1));
          setAudioQueue((prevQueue) => prevQueue.slice(1));
          audio.unload();

          playAudio();
        },
        onplay: () => {
          if (!analyserRef.current) analyserRef.current = Howler.ctx.createAnalyser();
          const analyser = analyserRef.current;
          Howler.masterGain.connect(analyser);
          analyser.connect(Howler.ctx.destination);
          analyser.fftSize = 512;
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          analyser.smoothingTimeConstant = 0.85;
          const bufferLength = analyser.frequencyBinCount;
          // analyser.getByteTimeDomainData(bufferLength);

          const draw = () => {
            const dataArray = new Uint8Array(bufferLength);

            analyser.getByteFrequencyData(dataArray);
            setBotWaveformData(dataArray);
            animationFrameId.current = requestAnimationFrame(draw);
          };

          draw();
        },
        onload: () => {
          audio.play();
        },
      });

      setCurrentAudioPlayer(audio);
    }
  };

  useEffect(() => {
    if (audioQueueRef.current.length > 0 && marksQueueRef.current.length > 0 && !isPlayingRef.current) {
      playAudio();
    }
  }, [audioQueueRef.current.length, marksQueueRef.current.length, isPlayingRef.current]);

  useEffect(() => {
    setStatuses({});
  }, [botId]);

  const stopRecording = () => {
    setIsGreetingPlayed(false);
    audioStop();
    setIsConnecting(false);
    setBotWaveformData(null);
    setIsPlaying(false);
    setIsCalling(false);
    setAudioQueue([]);
    try {
      currentAudioPlayerRef.current?.pause();
      recordAudioRef.current?.stopRecording();
      recordAudioRef.current?.destroy();
    } catch (e) {
      logger.error(e);
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    sendWebSocketRequest(voiceSocketRef, chatIdRef, 'stop', {});
  };

  const dialingAudio = useRef<HTMLAudioElement>(null);
  const audioPlay = async () => {
    if (dialingAudio.current) {
      dialingAudio.current.loop = true;
      await dialingAudio.current.play();
    }
  };
  const audioStop = () => {
    if (dialingAudio.current) {
      dialingAudio.current.currentTime = 0;
      dialingAudio.current.pause();
      // dialingAudio.current.remove();
    }
  };

  const startChat = () => {
    setIsConnecting(true);
    setChatIdRef(uuidv4());
    audioPlay();
    connectSocket();
  };

  const stopChat = () => {
    stopRecording();
  };

  return {
    startChat,
    stopChat,
    statuses,
    dialingAudio,
    isPlaying: isPlayingRef.current,
    isConnecting: isConnecting.current,
    isCalling: isCallingRef.current,
    botWaveform: botWaveformDataRef.current,
  };
};
