import logger from 'utils/logger.ts';
import { removePhoneNumber } from './phone.service.ts';

export const getPhoneNumber = async (newPhoneNumber: string, initPhoneNumber: string, cbErr?: (e: any) => void) => {
  if (newPhoneNumber === initPhoneNumber || !newPhoneNumber) return initPhoneNumber;
  try {
    if (initPhoneNumber) {
      await removePhoneNumber(initPhoneNumber).catch((e) => {
        logger.error(e.message, 'Error to delete old phone number');
      });
    }
    // await assignPhoneNumber();
    return newPhoneNumber;
  } catch (e: any) {
    logger.error(e, 'Error to get phone number');
    cbErr && cbErr({ message: e?.response?.data?.message || e.message });
    return initPhoneNumber;
  }
};
