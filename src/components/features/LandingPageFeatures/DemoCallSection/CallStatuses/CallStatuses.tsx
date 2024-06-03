import AddHuman from '../../../../../assets/svg/statusesSvg/AddHuman.svg';
import Adress from '../../../../../assets/svg/statusesSvg/adress.svg';
import Date from '../../../../../assets/svg/statusesSvg/Date.svg';
import Human from '../../../../../assets/svg/statusesSvg/Human.svg';
import PhoneNumber from '../../../../../assets/svg/statusesSvg/phoneNumber.svg';
import Plate from '../../../../../assets/svg/statusesSvg/plate.svg';
import Statistic from '../../../../../assets/svg/statusesSvg/statistic.svg';
import Table from '../../../../../assets/svg/statusesSvg/Table.svg';
import Time from '../../../../../assets/svg/statusesSvg/Time.svg';
import styles from './callStatuses.module.scss';

interface IconMapping {
  [key: string]: any;
}

const allMappings: IconMapping = {
  time: Time,
  name: Human,
  day: Date,
  phone: PhoneNumber,
  doctor: Human,
  table: Table,
  persons: AddHuman,
  order: Plate,
  address: Adress,
};

// const pizzeriaIconsMapping: IconMapping = {
//   id: 18,
//   time: Time,
//   name: Human,
//   addHumans: AddHuman,
//   day: Date,
//   phone: PhoneNumber,
//   seats: Table,
// };

// const serviceIconsMapping: IconMapping = {
//   id: 17,
//   time: Time,
//   name: Human,
//   'pre-order': AddHuman,
//   day: Date,
//   phone: PhoneNumber,
//   seats: Table,
// };

export const CallStatuses = (callStatuses: any) => {
  // const allMappings: { [id: number]: IconMapping } = {
  //   16: dentalIconsMapping,
  //   // 17: serviceIconsMapping,
  //   // 18: pizzeriaIconsMapping,
  // };

  if (!callStatuses.statuses) {
    return null;
  }
  return (
    <div className={styles.statusesContainer}>
      {Object.keys(callStatuses?.statuses).map((key: string, index: number) => {
        if (
          callStatuses?.statuses[key] !== null &&
          callStatuses?.statuses[key] !== 'null' &&
          callStatuses?.statuses[key] !== '' &&
          key !== 'status'
        ) {
          return (
            <div className={styles.status} key={index}>
              <img
                className={styles.icon}
                src={allMappings[key] !== undefined ? allMappings[key] : Statistic}
                alt={'img'}
              />
              <span className={styles.label}>{callStatuses?.statuses[key]}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
