import {
  AudioWaveComponent,
} from 'components/features/LandingPageFeatures/DemoCallSection/AudioWaveComponent/AudioWaveComponent.tsx';
import { FC, useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
import {Howl, Howler} from 'howler';

const payload = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAAPAAAF0AADBAQFBgYHBwhJSUpKS0xMTU1OT09QkJGSkpOTlJWVlpaXmNjZ2drb29zc3d7e4CAhIiIjIyQlJSYmJyhoaWlqa2tsbG1ubm9vcLGxsrKztLS1tba3t7j4+fr6+/v8/f3+/v/AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCwAAAAAAAABdANYIjKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAARcLJ8A0ZIAIZ+93f93d/xjxGWTJkwcBggKBQSIGIWjFCCH8FEBxYP4Yg+/g+H6gQBB31AgCAJh9QIOBA5//B8H4Pv/ggCH/iAEwfB8H37CTw86Ge5GwBtBOc4//NExA0TCWa8qYlIACj1ewtKTCgFo4ppkb0kDhhcjmT5WQRJ+wuMVP5/twvP7rYf5m1n+e55uMbapOXByRJH2lbKTxsMdGh6kneXCarYisFYRN0hKIzQHkXRXRYlUwK8//NExBMVALLF5894AALJ5oxizAYkml1zFvEeneqkW73V5FEMll9sRIJKlm5+rF0oLgIgKBYE71lWlwsYa8zq/9A53//z62ixwLAYeXeMqADEKoAKkBGqG8Bo0pvOWwIQ//NExBIWcabKPgvQPI+kb4qT8/qXY9O2AK1VW9pGcZAJXWmgODAWUZ44sLgiZSy5Z3++//xX/fAePtCQQ/w7h2RzKIhPPKoACopZi7G1zv//0ewKJtEzEkZqSmJQWn4k//NExAsU8Qr+XlJekgDh1aSi5rFhcAZmP5cEw4BomllYuwQs1auH4ScuMu3kE0jxNFcqNXqlBssCFSt6QZJCHrLHhVgvoXY9n6Nv///+7SfMiAoH3F6TVTLMYBzB1XGY//NExAoUmPrivHsMUOSAGPEynRigVjrE5EdjWPR9LZLMgMpj7e4OO3CZhY0jTERwUknYAMQ0rkJim5440A1pWseE3Uit6wqKQ891Ceghor////7EIRWpMjajoaKH42C4//NExAoUkNLp7npMagN5VMZ/jlDOFybbQaVHRcw2VgMahTMlkfy+eJf/YNiRe0iDg4m4ohRnl3mE0FUTsJA8HAi5JXpaOFq89qOL/9v3ULn2CMm4ghXuNFqqrmlAxLRI//NExAoSSS7+NmBG6hzAU2ej2JRlY4iemkT96w4z22wNOITply9qhgyd5Up/U1yKClMKIdMR9/g2HVHLoGQkXXRW1Jvgq3/3f7EWdyrVAbgLdFGqIsKdl02HTFxEWvCC//NExBMSgb7dlnjEdptAI6gFLBlqkThaeKlOW32UBZmIvNVnhWd3TXK9ptFo3W5VY5ilKyAmgaSJPCRB51rNn////h/AFuy1gXQAHWlII58CEzwdeD4MWkAUu7EHSRm7//NExBwSUTLOVnrGNQxPRJ8ehU43aZf9+roBOCEkrhesYUO2wlzuu4/XzdYNXhzz+7/oMw6Qxah+pqqgV3bMBzCgVBQMdYb1Nej9Q9gP1xY4CZY9xmhmAJblAZodGqzY//NExCUSMHLNvjvEDFRYKnQkDrxYImhMirpJlayj5PTYaaJxigGIVkr///+1EkAWNsCE2WIZAOUQCK6L2DSiyk9fQiFaOJNSpmEkO2srnGcxZ+3m5FqpSzZv7qrcx5Hq//NExC8SMTLCfnpEWDWIZhLaL1knuU54dNOQlFDnHgD////so8eiYQkk2yBcokH3IiJRvZGjtNAKtqoSOIYnnotOw0rqt6kKzKmcv6bbmszLlBHi1S/Io+CQIiIsOW9M//NExDkReSq2XsGENJDgakrX////ot1yxZFPmv5bzCso9iPtqQtZxeYTZp5FWIFGG7WRVV0KqAsjoj79rTZ2DTDOnilMFM6/kSzq3RJygnCjWnSyzppINNfvR///K6Lf//NExEYSQZ6xlHmEOh7jCCQlUJPhNlarLQmuR29hVesbOysy7ULvCiT2J6EjjZL2FK65ZVqi3J2elBKRrL95+ZeJekhISYsJOtkAYBhiLQnp+tAPafw0rgABY02irNRM//NExFAQuS58InjM6BpEwLk4GKSI0XPNRN5ZF/TxeTiWgYBOlWfqhjwQMQwEXxjjHqomkdX1Ut7f/1jjEjckporzjjLf3rg3Km6gI2pIIkFGJEkpyGSsUOFEWJHozBJ6//NExGASIY59njBHISW9Gfr/P+x1btVXcijLJb/XftTJNU53MAS1JqYgQiE8VEySRFzEqPdTLn6nf////LWUfBB4U4nMoooVxxcIg0SkQgkuYEopLEREIiDQyG1NFWyy//NExGoR6TZUEnmMAEUKoFhRipF+xpcTLO69RAoKjADbAQi7WjEItUi9dxpLFuY36CpV8jAepjzxUuVUDs1Q3AQV7I1b/TF/SAnPjuKVF4uEPciwLNA7oi2vdMm+oo4c//NExHUR8CpAEnpEBD/r4//3Zne9XiY0HO4pbX30/5NHf9dylD97czqf9Z5aEDrCtgTVJCJsOmTgbW5JLpvkZoRUdqxu0RLVo/QKXKSp8V6HO9XucIvsRYh9k1Z9jU2x//NExIATeE4wDMBGJVU0AUmiGCBRAfefI0mLRZIRdKI0OQj3VFzFj1M00oNV2bd17smtWpcpGd32MPJMIeTr99ANO2j+X4xdmbnsio703SRwF2+LBZXI+jWKybrSVXa7//NExIUMKBI8NHgGAH+jXPffr00Wh2hnZTuOEGrfORXFT6MO45bniw2Uckk4DHDI5sGbhYJ3vMLbLmpwt1wQ+LYWDCja7kHL9fpV79y07H/X8l8h9V2z+x3fT6n20f01//NExKcNOBo8NHiEAKpgVcGxnXkSKMljYDg6ZZsEpox7MmJbKuP0iYeJbJSVCM+lo2ENKV0R2z43lJ8vnLvq+sZ50uhLa+Ro/VhZjw8zS5Hf/oVrrMjvBgDRENw9kMBh//NExMUSuZIoAMDEXItzfhEq1mIOXiIJtCX4sM8fA3QGdVIUWWU3mBFovia7Pq6xrh7WpyLCvICaS3pfRVVksimvydr0rBnrZ3ZWuibIUiXZnuqWZWa+RvRVEKwOb/uu//NExM0JyBJM/HiGAAedtfr3JGKOa36PlUoiWnw8affZINgghduNvJ2NX2cEMbQEwooxJyjnMJtJHhYiNTZJq0R9ChGkmBBEnJ1CxAUeU0kaVniYP2MGnlIDNbzA1EzF//NExPgW8mYoFMmGDQmeJmDcCKUyF7Aq8cjCg0NmCQnesEHDyx1m5BpJa9UkYOVyrWqoDbDb2Mjiwvkyp6pYz98v/7EKtHlHLEMUR1Ls6j/6k9DmlnvIfTT77+dhKUXs//NExO8VskooAMGEPc4uRtSl9WMzZso6Hlk1vFXvFCxNTEFNRTMuMTAwVVVVVVVVBl1uOuRgG2PGERKVH7KttGqc6ej1J7POeQNIWO9KKtv9pjtKo9zrf+iNCfkzHmYC//NExOsTMF44EsJGCIYMViECuo0Rojc2tvnS0z+0AOsJB2QMQE7oVYzHwDbEk7yvJka7DYQtG0ABHkND9+m4cs2OH1uYIvdFaChATTEXhI7r+yItyiLHc/pdJjQxLTlK//NExPEXqxosAMGGNJPlxYWrpb5kfDrmSdImP/0PywZv4gISKDOrSicEgtigZFAVGAwhI0Jogk2fgOTqKFO2G17CRNzSiKYB9a0gUJLzjHu9KWQEHxPQff4tv3pdUiP7//NExNYKgBpc/ljEAKu9br7Gh2+V4lmBtR7cbkMLYWwVM0pcDsqktM0vA0cIGX5lGwnp4GICQiFLzSKRojqtJSZOCz73NAqzdRsakMLICEGELY4eC6IILAcH3F9U66IO//NExP8b6x4oAMGGtMLPjy1fEKpMvWcIKU+++xBnBxUqVkFWnX6QQaQRlyyRA6qDptaipDfPU/tJGhWREzkM+exRkbup2EFTzcsviM9Rtq2Zhoz1dfVR/r7nf859dzHq//NExOIR2L48AMJGFGqKMATT1qV1WKWF4y7ftbK1QjoeJUg2lMg+1zMrH1nTo9pxb+1IR55jSPXqDKgh+etWqhLGZrVxYYAYYFBLYcH11lkVodVaZoawyIG2xV+KX9/T//NExO0WUP44AMMMMFWQDQ1V4PTZBdKXUHC8pGU6plCtEY4KnrNwnkjDK97CcMyMI1bE0bCsTqAsIVEUV3oky5FPuXuV3A2Vx5cpX7nWwRVocFEPlAgVca+TfStbrGuS//NExOYP2YZMFHmGDJJB/U2ygdtY3/yzoooEur0s/V6ddPYtW+WMm1UfqoXhaLgpyrnKLvBkQq2pXZBX5Jlj95r3PKRGYgf5p/cliafC5bT6UQQGBpofbqUYbMbNXbzp//NExPkVaWJIFnmEuCr/+z3YvSI8ByaNN7p+L9LqJtdEcGkbAxdMjpW6w0gMU91CWJWL9d9DMS0Uiuf/AyKgoVlc+QqHB20wYEphR6UEYQZVcSWnoIgMVlQnlXBD2VlH//NExPYXGZpIMnpGnAOxxAgFGE02Z5t1kb+6i8qirmbfb2oYXQGCwN7q6ENOtvCQw7IVy4qEJEiAKpnzWQk+8XJjc0WsiaWBvOpYDCU37WVKN6ho8OpFXgEDT4dKFwTO//NExOwS6X5EAHmGtIAaD6AUCqJ2y5Hd+U//7tF2xCnEkgHgAiqsj9ues8V+1xIblZdNqATxk+rn/T+KIUtlkouXJ1/Trcs2BwdWqt+1ucpaWQ77N/3PbT/mRi5zXlDn//NExPMZMYpAAMMMfJwxELMccjTwtr1pliBMQDpAmKio5gEM1ffVDccl0Vmv4AC/ynPiNWADkgkgRAaZJEvCy5v0npA5PaUlGFVYTWwgRgjDGVg7m0jRcjYToZOERoXP//NExOET+PpUFGIMpEbJ0gjgiLRYMWPFEMv1VEAP1gyq4vS4xdcsjTyEJ8YNgG6bHX7CK51BZ8P0780bC8n3nUEx1EY+JxwVrnXRiZ3mRGvbKLDGNTYepCghAFNHxYcL//NExOQVyb5UFHpMtC3xqlmFb4u/V/3+uv7EKgwK55Af5SihbWB4iDLzIwl+lIIFV3LH8INuUq0yzKteoaTPsrsJnCc0XBglY2faVQEJgI0Q//F2tgDW8YmWEvfMQRMD//NExN8R+YqCXjDFLGcEQkFj44jHEoFnrVk4lgmwAb0J1C4xVjR0OiYYkMcRLEIoEWNrKdyqDrO0pvJcMhhoDIkJ9AJw68klu8GqtbF8nCVdWA1DDGcOwgyTVes4MKAb//NExOoUsZJcNGJKfE9V83M+o2xKuh17qCMQ+gCNmLzsqvx0YJ9VcSEVychBhvekdqSrLychHStV9QitSwgEYqbW3ZQ7qzZTm7+ddWikbj65W/9DKSh4OJaKogkIAg6M//NExOoUsZ5UCnpGtpwZGH6/0K/R/94gAD6gM4WF3HflPfTpGz5iqhwtqkOSiIy7eNgjd455pEOkX+VhwEBVj4Z3U22yIsvu5zLJiP3yzaNDZghiIx989gzKsau4jGkm//NExOoUOYpYFGGG0du7v///aiRqDAirHuzqxOumRkXkCxI49mBNORLBKYekxIcIW21U4krMMf+0H20QqimcJhCJ1Aowyv5czBuEr3+7he8YEDU0ZKiERLr0JMAqHBIO//NExOwT+Y5cFGGQsHJLsGCE8SOmUtdCArt////oDAdbfAaMEa1JJeE9xSZlUQxwHIWmDx9UzJxMtjE0mpJpohnPhVClN+FjBMvk5LavWr9MJNJA0BUiomCygiFGG1Fw//NExO8UEcJcVGGGzDicKqx7HOeY2mPd////14+FHWopLpjpVVEWE5dCiGWdA7CEuSR+lkjtJMSbTVCEUUt9EDSOd0tZqRkCnAZAQUetCREeDkWKuBoSuIo8iJYdYtWy//NExPEXAXpQCnpGujiuRs2XqT6ttH9NKj3/dhTTwJvdaXaIEI6k2ERAVubUNL2USJ2Rh3ppTQ7Zf6N2bJuM7Eg0BhriiSp46kEi0VFrq016PR/mdb0uxe77v/VrEUfd//NExOgUOPpQCnsSFPrTFGzOpfnpuNNeZKu59GA79cMFtGzN5OpM4j971XOokN9V5bX/LLZ0fNHStd1ZdrRCHcPbn061f/+9MqRklVRNDBfqiqwWsCSWUq7agaYVuJvM//NExOoT2OpMCnpMEIxSErXuaZK3LUgvEKVhylETr9g2ByptCfXKU2mMDLmjOq5mxVZjLGYjUlU2aZCnDB1g46eFA6GL3mx7bdolGCwBNCZQc2N0rUNq98gs3cm42p91//NExO0RAOpUNHpMDO61T2IlvSgSzLAR3jEDHA2yuaTH1gbVXJaUG13AUleEwohdSMhh1mkrkWZeQzHxmP1E1O8LUy/p6dOXP+MyqnF+0m06embFzql50unDl+0YvLv9//NExPwZIZ40AsMGmEgvyP0x1B96fHEs641c3PCpOhCcmOQ4DpqTIA4CMIkiM2hWKSPAIVJigOuMhgeUMgUqRjOTiqnoFQtPdTIICzKLjlp8DIQKPvY55mljHE2Oas/d//NExOoSwMI8AsJGGBdzjJOl5BD6jJImShuTqzcgSmfZNNuHBzVkBoH1H2kvcofpDumSSL8a0qX3q90P3B7ZZTL63C+NJSKFP9JueXwp/tmd/8r846ZEeTV/5lAdDM8e//NExPIXYt40NMJGDIcP+QBdRGfq2913KSUDyY9mjFgWULoy40GHMKTWbU0BL0iOQnaOVVzzKkf4Uvyn/tc+WX5bfqZeeckdAUOJRnL+Zf/33gfaQsM8zksmPcXD+kK7//NExOcTMFowAsGMAk1LCs7lw36v19RyESoiqQhIQqcuFupDY5I2kY50g3iA1r88OM6r85Ls1ZcxodB9QNCWCgCllixzBAcBGL2tu7uQRUIsIqaQYZqO8//fX/pI/R+u//NExO0U6nYsAMJGCQBIQpXg2z144fNn/jsseff27fvvZtOV1UxvjqlQ+8JVr09/+/DNyIUKQt9yg6sPPtF0jjFSPOpOEwkxA6dCKExI5kzXV2u6raTAMU815JEgo7fe//NExOwVMXosAMJGEeV45kSZO6+nqcE9EZoWeXHNkIUjDL2nCDlkASSQfeBDY8k842SklBRez2/qetP6mKUqWqQBeMA1DgSwCoACieDYRiqNIo0RSWfJtPKCvDuRCQFJ//NExOoa8Mo4qsaQMWRbflQFZkQlBUs0cFAUAoCeGhESCoTuLIbNLGxKnYYu2OpVed0ezFjVRhaUlAD5ojAsvRNMixoqxbq6L3VbsZxnv7SHMnt1thX1ILPXyK0qXkmL//NExNEXCUJVdMmGqGHh82uWi9aS1jCoSe6pkUlhIkl5pJ5itNRecrXIyy/VQBAUZox1qu3GbZmYwoCJ1VdVJhK+zH/Gb2oUChqmdDoKmfUHQVEXqIFh50RHREVdiIqG//NExMcSaEJQFGMMJIrf4iZ+tyoQ0wkfRWGTBahkyyzNZSNWjkZNZaTWOTLUcjVrIZNYatKhkataRrKTLZUMmWRyawyaWUjVgtQ1awy5YZMoaORrL/yoZMFiLBNvS0qg//NExNAN8CooVmFGANDVBqq0VSwTEHJSslVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExOsSyWn4ADBG4FVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExPIWCmWkAAhGCVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

export const TestRecordRTC: FC = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<RecordRTC | null>(null);
  const srcRef = useRef<string | undefined>();
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const sound = new Howl({
    src: [`data:audio/mpeg;base64,${payload}`, `data:audio/mpeg;base64,${payload}`],
  });


  const decodeBase64ToWav = (base64String: string) => {
    const binaryString = window.atob(base64String);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: 'audio/webm; codecs=opus' });
    return URL.createObjectURL(blob);
  };

  const sendData = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // console.log(base64String, 'send', srcRef.current);

      // const blobUrl = decodeBase64ToWav(base64String.replace('data:audio/wav;base64,', ''));
      const blobUrl = base64String;
      srcRef.current = blobUrl;
      const audio = new Audio(blobUrl);
      audio.play();
    };
  };


  const playAudio = () => {
    // const blobUrl = decodeBase64ToWav(payload);
    const audio = new Audio(`data:audio/mpeg;base64,${payload}`);
    audio.play();
  };


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAudioWithHtmlEl = () => {
    const audioUrl = `data:audio/mpeg;base64,${payload}`;
    // const audio = new Audio(audioUrl);
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.src = audioUrl;
    audio.play();
  };


  const streamRef = useRef<MediaStream | null>(null);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        mediaRecorder.current = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm;codecs=pcm',
          // eslint-disable-next-line import/no-named-as-default-member
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          disableLogs: false,
          timeSlice: 5000,
          desiredSampRate: 16000,
          ondataavailable: (blob: Blob) => {
            sendData(blob);
          },
        });
        mediaRecorder.current.startRecording();
        setRecording(true);
      })
      .catch((error) => console.error('Error accessing media devices:', error));
  };

  const stopRecording = () => {
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stopRecording(function() {
      if (!mediaRecorder.current) return;
      // const blob = mediaRecorder.current.toURL();
      // // srcRef.current = blob;
      //
      // console.log(blob);
      // const audio = new Audio(blob);
      // audio.play()
      // invokeSaveAsDialog(blob);
    });
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {/*<AudioWaveComponent*/}
      {/*  audio={undefined}*/}
      {/*  // stream={streamRef}*/}
      {/*  isCalling={recording}*/}
      {/*  isConnecting={recording}*/}
      {/*  // botWaveformData={null}*/}
      {/* botWaveformData={null}/>*/}
      <div>
        <h5>Recorded:</h5>
        {
          <>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio ref={audioRef} controls src={srcRef.current}></audio>
          </>
        }
      </div>

      <div>
        <h5>Play by audio html element</h5>
        <audio ref={audioRef} controls />
        <button onClick={playAudioWithHtmlEl}>Play by audio html element</button>
      </div>

      <div>
        <h5>html element</h5>
        <audio src={`data:audio/mpeg;base64,${payload}`} controls />
      </div>

      <button onTouchStart={playAudio} onClick={playAudio}>Play by new Audio()</button>

      <button onClick={()=> {
        sound.play();
      }}>Howl play</button>
    </div>
  );
};
