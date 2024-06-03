import cx from 'classnames';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import useStateRef from 'react-usestateref';
import s from './AudioWaveComponent.module.scss';
import { BOT_WAVE_COLOR, USER_COLOR } from './constants.ts';

export type AudioWaveComponentProps = {
  isCalling: boolean;
  isConnecting?: boolean;
  botWaveformData: Uint8Array | null;
};
export const AudioWaveComponent: FC<AudioWaveComponentProps> = ({ isCalling, isConnecting, botWaveformData }) => {
  const [, setAnalyser, analyserRef] = useStateRef<AnalyserNode | null>(null);
  const [, setSource, sourceRef] = useStateRef<MediaStreamAudioSourceNode | null>(null);
  const [, setMicrophone, microphoneRef] = useStateRef<MediaStream | null>(null);
  const [userColor] = useState(USER_COLOR);

  const baseRef = useRef<HTMLDivElement | null>(null);

  const canvasOpacityRef = useRef<HTMLCanvasElement | null>(null);
  const canvasOpacityContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const userCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const userCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const botWaveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const botCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    initBinCanvas();
  }, [userCanvasRef.current, canvasOpacityRef.current]);

  useEffect(() => {
    isCalling ? useMic() : reset();
  }, [isCalling]);

  // play audio waveform

  useEffect(() => {
    const drawBotWaveform = () => {
      // analyserRef.current?.getByteFrequencyData(botWaveformData!);
      // setOpacity(dataArrayRef.current!, botWaveformData!);
      drawBars(botWaveformData || ([] as unknown as Uint8Array), botWaveformCanvasRef, botCanvasCtxRef, BOT_WAVE_COLOR);
      // animationFrameId.current = requestAnimationFrame(drawBotWaveform);
    };

    drawBotWaveform();
  }, [botWaveformData]);

  // user waveform
  const useMic = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        setMicrophone(stream);

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        setSource(source);
        setAnalyser(analyser);
        analyser.fftSize = 512;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          analyser.getByteFrequencyData(dataArray);
          drawBars(dataArray, userCanvasRef, userCanvasCtxRef, USER_COLOR);
          requestAnimationFrame(draw);
        };

        draw();
      })
      .catch((err) => {
        console.error(err);
        alert("Can't get microphone data! (Please try in a supported browser)");
      });
  };

  const initBinCanvas = () => {
    if (userCanvasRef.current && canvasOpacityRef.current && botWaveformCanvasRef.current) {
      userCanvasRef.current.width = (baseRef.current?.offsetWidth || 0) + 100;
      userCanvasRef.current.height = (baseRef.current?.offsetHeight || 0) + 100;
      userCanvasCtxRef.current = userCanvasRef.current.getContext('2d')!;

      window.addEventListener('resize', onWindowResize, false);

      canvasOpacityRef.current.width = baseRef.current?.offsetWidth || 0;
      canvasOpacityRef.current.height = baseRef.current?.offsetWidth || 0;
      canvasOpacityContextRef.current = canvasOpacityRef.current.getContext('2d')!;

      botWaveformCanvasRef.current.width = (baseRef.current?.offsetWidth || 0) + 100;
      botWaveformCanvasRef.current.height = (baseRef.current?.offsetHeight || 0) + 100;
      botCanvasCtxRef.current = botWaveformCanvasRef.current.getContext('2d')!;
    }
  };

  const onWindowResize = () => {
    if (userCanvasRef.current && userCanvasRef.current?.width)
      userCanvasRef.current.width = (baseRef.current?.offsetWidth || 0) + 100;
    if (userCanvasRef.current && userCanvasRef.current?.height)
      userCanvasRef.current.height = (baseRef.current?.offsetHeight || 0) + 100;
  };

  const reset = () => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    // if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    microphoneRef.current?.getTracks().forEach((track) => track.stop());

    canvasOpacityRef.current!.style.opacity = '0';
  };

  const drawBars = (
    array: Uint8Array,
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    contextRef: MutableRefObject<CanvasRenderingContext2D | null>,
    color = userColor,
  ) => {
    const threshold = 0;
    const maxBinCount = array.length;
    // const average = array.reduce((acc, value) => acc + value, 0) / maxBinCount;
    //
    // const someOneTalking = document.getElementById('someOneTalking');
    //
    // if (someOneTalking) {
    //   someOneTalking.innerHTML = average > 40 ? 'Someone is talking' : '...';
    // }

    contextRef.current?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    contextRef.current?.save();
    contextRef.current!.globalCompositeOperation = 'source-over';
    contextRef.current?.scale(0.5, 0.5);
    contextRef.current?.translate(contextRef.current?.canvas.width || 0, contextRef.current?.canvas.height || 0);
    contextRef.current!.fillStyle = color;

    const radius = -((baseRef.current?.offsetWidth || 0) + 1);
    const bar_length_factor = window.innerWidth >= 785 ? 3.0 : 7.0;

    for (let i = 0; i < maxBinCount; i++) {
      const value = array[i];
      if (value >= threshold) {
        contextRef.current?.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, -value / bar_length_factor);
        contextRef.current?.rotate(((180 / 128) * Math.PI) / 360);
      }
    }

    for (let i = 0; i < maxBinCount; i++) {
      const value = array[i];
      if (value >= threshold) {
        contextRef.current?.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, -value / bar_length_factor);
        contextRef.current?.rotate((-(180 / 128) * Math.PI) / 360);
      }
    }

    for (let i = 0; i < maxBinCount; i++) {
      const value = array[i];
      if (value >= threshold) {
        contextRef.current?.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, -value / bar_length_factor);
        contextRef.current?.rotate((-(180 / 128) * Math.PI) / 360);
      }
    }

    for (let i = 0; i < maxBinCount; i++) {
      const value = array[i];
      if (value >= threshold) {
        contextRef.current?.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, -value / bar_length_factor);
        contextRef.current?.rotate(((180 / 128) * Math.PI) / 360);
      }
    }

    contextRef.current?.restore();
  };
  // const setOpacity = (dataArray: Uint8Array, bufferLength: number) => {
  //   canvasOpacityContextRef.current!.clearRect(0, 0, canvasOpacityRef.current!.width, canvasOpacityRef.current!.height);
  //
  //   let average = 0;
  //   for (let i = 0; i < bufferLength; i++) {
  //     average += dataArray[i];
  //   }
  //
  //   average = average / bufferLength;
  //   canvasOpacityRef.current!.style.opacity = `${average / 75}`;
  //   // Assuming `animation` is a React ref for an HTML element
  //   // You need to define `animation` using useRef
  //   // const animation = useRef(null);
  //   // animation.current!.style.border = `solid ${average / 75}px #fff300`;
  // };

  return (
    <div id="chart-container" className={s.chartContainer}>
      <div className={s.base} ref={baseRef}>
        <div className={`${s.lens} ${isConnecting ? s.pulsatingCircle : ''}`}>
          {/*<div className={s.reflections}></div>*/}
          <canvas
            id="audioWaveCanvas"
            width="0"
            height="0"
            className={cx(s.canvas, s.audioWaveCanvas)}
            ref={userCanvasRef}></canvas>
          <canvas
            id="botAudioWaveCanvas"
            width="0"
            height="0"
            className={cx(s.canvas, s.audioWaveCanvas)}
            ref={botWaveformCanvasRef}></canvas>
          <canvas
            id="opacityCanvas"
            width="0"
            height="0"
            className={cx(s.animation, s.canvas)}
            ref={canvasOpacityRef}></canvas>
        </div>
      </div>
    </div>
  );
};
