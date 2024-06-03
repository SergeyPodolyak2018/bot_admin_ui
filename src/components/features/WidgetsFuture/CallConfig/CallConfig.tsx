import { FC } from 'react';
import { addNotification, useAppDispatch } from 'store';
import { BotFull } from 'types';
import s from './CallConfig.module.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';

export type CallConfigProps = {
  bot: BotFull;
};
export const CallConfig: FC<CallConfigProps> = ({ bot }) => {
  const dispatch = useAppDispatch();

  const attr = `data-voice="${bot!.id}"`;

  const code = `<script>
    (function(d, w) {
        var c = {vid: '${bot!.id}'};
        c.s = '[data-voice="${bot!.id}"]';
        if(w.voice_bots) w.voice_bots.push(c);
        else w.voice_bots = [c];
        if(!w.vs) {
            w.vs = true;
            var s = d.createElement('script');
            s.async = true;
            s.type = 'module';
            s.src = '${document.location.origin}/widget/voice.js';
            if (d.head) d.head.appendChild(s);
        }
    })(document, window);
</script>`;

  const handleCopyAttribute = () => {
    navigator.clipboard.writeText(attr).then(() => {
      dispatch(
        addNotification({
          message: '',
          type: 'success',
          title: `${attr} copied to clipboard`,
        }),
      );
    });
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        dispatch(
          addNotification({
            message: '',
            type: 'success',
            title: 'Script copied to clipboard',
          }),
        );
      })
      .catch((error) => {
        dispatch(
          addNotification({
            message: '',
            type: 'error',
            title: "Script wasn't copied to clipboard",
          }),
        );
        console.error('Failed to copy code: ', error);
      });
  };

  return (
    <div className={s.calls}>
      <div className={s.codeBlock}>
        <Alert severity="info">
          Use{' '}
          <b style={{ cursor: 'pointer' }} onClick={handleCopyAttribute}>
            {attr}
          </b>{' '}
          attribute for your selector. You can use custom selector. (#button, .class, data-custom)
        </Alert>

        <TextField
          style={{ width: '100%', maxWidth: 600 }}
          disabled={true}
          multiline
          rows={16}
          variant="outlined"
          value={code}
        />
        <Button onClick={handleCopyClick} variant="contained" sx={{ mt: 2, width: 100 }}>
          Copy
        </Button>
      </div>
    </div>
  );
};
