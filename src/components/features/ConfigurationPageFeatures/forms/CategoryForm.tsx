import classnames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { postCategore } from 'services';
import { activeBotSelector } from 'store';
import { TCategore } from 'types';
import { fieldsSerializer, idCreator } from 'utils/botUtils.ts';
import logger from 'utils/logger.ts';
import { Button as TryItNowButton } from '../../../common/index.ts';
import { Button as CustomButton } from '../../LandingPageFeatures/index.ts';
import { FieldsGenerator } from '../forms2/index.ts';
import { categoryFields, categoryFieldsSpecial } from '../forms2/const.ts';
import stylesMain from '../forms2/Forms.module.scss';
import { TFormProps } from './Form.types.ts';
import styles from './Forms.module.scss';
import { getDefaultPromptWithData } from 'utils/template.ts';
import { useDispatch } from 'react-redux';
import { addCategory } from 'store';

const cx = classnames.bind(styles); // <-- explicitly bind your styles

export const CategoryForm = ({ data, createNode, close, idSaver }: TFormProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activeBot = useSelector(activeBotSelector);
  // const inputStyle = {
  //   width: '90%',
  //   marginTop: '10px',
  // };
  const className = cx({
    [styles.tipicalForm]: true,
    [styles.upper]: true,
  });
  const classBody = cx({
    [styles.body]: true,
    [styles.big]: true,
  });
  // const create = () => {
  //   const newNode = {
  //     id: data.type + '1',
  //     type: data.type,
  //     position: { x: data.x, y: data.y },
  //     data: { label: `${data.type} node` },
  //   };

  //   createNode((nds) => nds.concat(newNode));
  //   close();
  // };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const unionid = idSaver.newId - 1;
    const formData = new FormData(event.currentTarget);
    const entries = Object.fromEntries(formData);
    const preparedData = fieldsSerializer([...categoryFields, ...categoryFieldsSpecial], entries) as Partial<TCategore>;
    preparedData['botId'] = activeBot;
    preparedData['id'] = unionid;
    preparedData['design'] = JSON.stringify({ x: data.x, y: data.y });

    try {
      //const resp = (await postCategore(preparedData)).data;
      dispatch(addCategory(preparedData as TCategore));
      const newNode = {
        id: idCreator('file', unionid),
        position: { x: data.x, y: data.y },
        type: 'category',
        data: {
          label: preparedData.name,
          value: preparedData.id,
          id: preparedData.id,
          preprocessor: preparedData.preprocessor,
          splitterType: preparedData.splitterType,
          threshold: preparedData.threshold,
        },
      };
      createNode((nds) => nds.concat(newNode));
      idSaver.iterate(unionid);
    } catch (err) {
      logger.error(err);
    }
    close();
  };

  return (
    <div className={styles.blureWrap}>
      <div className={className}>
        <form onSubmit={handleSubmit}>
          <div className={stylesMain.header}>{t('configurationPageFeatures.createAndAddCategory')}</div>
          <div className={classBody}>
            {[...categoryFields, ...categoryFieldsSpecial].map((el) => {
              return FieldsGenerator({
                ...el,
                key: el.name,
                value: null,
              });
            })}
          </div>
          <div className={stylesMain.footer}>
            <CustomButton
              onClick={close}
              label={t('configurationPageFeatures.close')}
              style={{ height: '48px', width: '130px' }}
            />
            <TryItNowButton
              label={t('configurationPageFeatures.send')}
              style={{ height: '48px', marginLeft: '20px', width: '130px' }}
              type="submit"
              onClick={() => {}}
            />
            {/* <Button variant="outlined" onClick={close}>
              Close
            </Button>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} style={{ marginLeft: '20px' }}>
              Send
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
};
