import logger from 'utils/logger.ts';
import { BotFormFields, ValidationState } from './CreateBotForm/CreateBotForm.types.ts';

export const validate = (
  fields: BotFormFields,
  state: ValidationState,
): {
  errors: ValidationState;
  isValid: boolean;
} => {
  const errors = { ...state };

  // errors.greeting = !fields.greeting;
  logger.debug(fields.prompt);
  errors.name = !fields.name;
  if (fields.prompt !== undefined) {
    errors.prompt = !fields.prompt;
  } else {
    errors.prompt = false;
  }
  errors.language = !fields.language;

  return { errors, isValid: !errors.prompt && !errors.name && !errors.greeting && !errors.language };
};
