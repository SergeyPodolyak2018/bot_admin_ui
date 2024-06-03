import { detectIncognito } from 'detectincognitojs';
import logger from 'utils/logger.ts';

export const getDeviceInfoInBrowser = async (device: any) => {
  const pc = await getPcInfo();
  const mediaDevices = await getMediaDevices();
  const url = getUrlInfo();
  const date = getDateInfo();
  const memory = await checkMemory();
  const incognito = await checkIncognito();
  const vpn = device?.geo?.timezone ? checkVpn(device.geo.timezone, date.timezone) : 'unknown';

  return {
    pc,
    mediaDevices,
    url,
    date,
    memory,
    incognito,
    vpn,
  };
};

const checkIncognito = async () => {
  const result = await detectIncognito();
  return result.isPrivate;
};

const checkMemory = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();

    const mbUsage = usage ? `${bytesToMB(usage)}MB` : 'unknown';
    const availableMemory = quota ? `${bytesToMB(quota)}MB` : 'unknown';
    const usagePercent = usage && quota ? usage / quota : 'unknown';

    return {
      usage,
      quota,
      usagePercent,
      mbUsage,
      availableMemory,
    };
  } else {
    logger.info('check memory() => Can not detect');
  }
};

const bytesToMB = (bytes: number) => {
  return bytes / (1024 * 1024);
};
const getDateInfo = () => {
  const date = new Date();

  return {
    timestamp: date.getTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateIso: date.toISOString(),
    offset: date.getTimezoneOffset(),
  };
};

const getPcInfo = async () => {
  const quota = (await navigator.storage.estimate()).quota;
  // const memory = performance.memory.jsHeapSizeLimit / 3;
  const logicalCores = navigator.hardwareConcurrency;
  const resolution = getScreenResolution();
  return {
    quota,
    // memory,
    resolution,
    logicalCores,
  };
};

const getUrlInfo = () => {
  const { pathname, port, host, href, origin, protocol } = window.location;
  return {
    pathname,
    port,
    host,
    href,
    origin,
    protocol,
  };
};

export const getMediaDevices = async () => {
  const mediaDevices: any[] = [];
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    logger.error('getMediaDevices err: enumerateDevices() not supported.');
  } else {
    // List cameras and microphones.

    await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.map((d) => {
          mediaDevices.push({
            deviceId: d.deviceId,
            groupId: d.groupId,
            kind: d.kind,
            label: d.label,
          });
        });
      })
      .catch((err) => {
        logger.debug(`${err.name}: ${err.message}`);
      });
  }
  return mediaDevices;
};

const checkVpn = (geoTimezone: string, localTimezone: string) => {
  const tz = new Intl.DateTimeFormat('en', { timeZone: geoTimezone }).resolvedOptions().timeZone;
  return tz !== localTimezone;
};
const getScreenResolution = () => {
  return {
    width: window.screen.width,
    height: window.screen.height,
    outerWidth: window.outerWidth,
    innerWidth: window.innerWidth,
    colorDepth: window.screen.colorDepth,
    // availWidth: window.screen.availWidth,
    // availHeight: window.screen.availHeight,
  };
};
