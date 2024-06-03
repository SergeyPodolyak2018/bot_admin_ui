// `StatusMessages` is a helper component for displaying messages while in
// development. This has no impact on your integration and can be deleted.
import { FC, useReducer } from 'react';

export const StatusMessages: FC<{ messages: string[] }> = ({ messages }) =>
  messages.length ? (
    <div id="messages" role="alert">
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  ) : (
    ''
  );

// Small hook for adding a message to a list of messages.
export const useMessages = () => {
  // helper for displaying status messages.
  return useReducer((messages: string[], message: string) => {
    // Embed link
    return [...messages, message];
  }, []);
};
