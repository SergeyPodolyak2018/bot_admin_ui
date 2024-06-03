export interface ICallStatusesProps {
  statuses: ICallStatus[];
}

export interface ICallStatus {
  keyword: string;
  text: string;
}

export interface IDentalCallStatus {
  day: string | null;
  doctor: string | null;
  name: string | null;
  phone: string;
  status: string;
  time: string | null;
}
