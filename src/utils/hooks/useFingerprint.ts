import { useEffect, useState } from 'react';
import { getDeviceInfoInBrowser } from 'services';
import { getDeviceInfo } from 'services/api';
import { selectDevice, setDeviceInfo, useAppDispatch, useAppSelector } from 'store';

export const useFingerprint = () => {
  const dispatch = useAppDispatch();
  const device = useAppSelector(selectDevice);
  const [apiInfo, setApiInfo] = useState(null);
  // const { data } = useVisitorData({ extendedResult: true }, { immediate: true });

  useEffect(() => {
    if (device) return;
    getInfoFromApi();
  }, [device]);

  useEffect(() => {
    getInfoFromBrowser(apiInfo);
  }, [apiInfo]);

  const getInfoFromApi = async () => {
    const res = await getDeviceInfo();
    setApiInfo(res.data);
    dispatch(setDeviceInfo({ ...device, ...res.data }));
  };
  const getInfoFromBrowser = async (device: any) => {
    const browserInfo = await getDeviceInfoInBrowser(device);
    dispatch(setDeviceInfo({ ...device, browserInfo }));
  };

  return {
    device,
  };
};
