import { BrowserRouter } from 'navigation';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from 'store';
import { injectStore } from 'utils/axios';
import { usePing } from 'utils/hooks';
import './i18n';

export const App = () => {
  injectStore(store);
  usePing();

  return (
    <Provider store={store}>
      <RouterProvider router={BrowserRouter} />
    </Provider>
  );
};
