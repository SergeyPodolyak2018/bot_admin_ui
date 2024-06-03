import TextField from '@mui/material/TextField';

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { Tooltip } from 'components/common';
import { ChangeEvent, useEffect, useState } from 'react';
import { setKeynum, setThreshold, useAppDispatch } from 'store';
import { TCategore } from 'types';
import styles from './advanced.module.scss';

interface IAdvancedConfig {
  category: TCategore;
}

const styleInputs = {
  style: {
    borderRadius: '10px',
    width: '260px',
    height: '47px',
  },
};

export const AdvancedConfig = (props: IAdvancedConfig) => {
  const dispatch = useAppDispatch();
  const [kNum, setLocalKnum] = useState(props.category?.kNum);
  const [threshold, setLocalThreshold] = useState(props.category?.threshold);
  const [thresholdErr, setLocalThresholdErr] = useState(false);
  const [kNumErr, setLocalKnumErr] = useState(false);

  useEffect(() => {
    setLocalKnum(props.category?.kNum);
    setLocalThreshold(props.category?.threshold);
  }, [props.category?.threshold, props.category?.kNum]);

  const setDefaultValueKNum = (event: ChangeEvent<HTMLInputElement>) => {
    const val = Number(event.target.value);

    if (!isNaN(val) && val >= 0) {
      setLocalKnumErr(false);
      dispatch(setKeynum({ id: props.category.id, value: val }));
      //setLocalKnum(val);
    } else {
      dispatch(setKeynum({ id: props.category.id, value: 0 }));
      //setLocalKnum(val);
      //setLocalKnumErr(true);
    }
  };
  const setDefaultValueThreshold = (event: ChangeEvent<HTMLInputElement>) => {
    const val = Number(event.target.value);
    if (!isNaN(val) && val <= 1 && val >= 0) {
      const rezult = +val.toFixed(2);
      setLocalThresholdErr(false);
      dispatch(setThreshold({ id: props.category.id, value: rezult }));
      //setLocalThreshold(val);
    } else {
      dispatch(setThreshold({ id: props.category.id, value: 0 }));
      //setLocalThreshold(val);
      //setLocalThresholdErr(true);
    }
  };
  return (
    <div className={styles.config}>
      {/*{JSON.stringify(props.category)}*/}
      <span className={styles.label}>
        Responding to each user request, the knowledge base is searched for relevant information and filtered. Document
        count and Threshold are necessary to fine-tune the search parameters in the knowledge base, which is carried out
        after each client request
      </span>
      {props.category && (
        <div className={styles.fiedsContainer}>
          <div className={styles.fieldHolder}>
            <div className={styles.fieldName}>
              <span className={styles.fieldLabel}>Document Counts</span>
              <Tooltip
                arrow
                placement={'right'}
                iconClassName={styles.tooltipIcon}
                text={`The maximum count of the most relevant documents that will be used for answering`}
                withIcon
              />
            </div>
            <TextField
              id={'kNum'}
              name={'kNum'}
              variant="outlined"
              value={kNum}
              multiline={false}
              style={{ width: '100%' }}
              type={'number'}
              onChange={setDefaultValueKNum}
              inputProps={{
                step: 1,
              }}
              InputProps={styleInputs}
              error={kNumErr}
              // onChange={changePromptText}
            />
          </div>

          <div className={styles.fieldHolder}>
            <div className={styles.fieldName}>
              <span className={styles.fieldLabel}>Threshold</span>
              <Tooltip
                arrow
                placement={'right'}
                iconClassName={styles.tooltipIcon}
                text={`This value will be used to filter out data fragments that are not relevant enough to the original user request. This value ranges from 0 to 1, where 0 means identical and 1 - dissimilar to the user request.`}
                withIcon
              />
            </div>
            <TextField
              id={'threshold'}
              name={'threshold'}
              variant="outlined"
              value={threshold}
              multiline={false}
              style={{ width: '100%' }}
              type={'number'}
              inputProps={{
                step: 0.1,
              }}
              InputProps={styleInputs}
              onChange={setDefaultValueThreshold}
              error={thresholdErr}
              // onChange={changePromptText}
            />
          </div>
        </div>
      )}
    </div>
  );
};
