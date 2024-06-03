export const pythonTimestampToJsTimestamp = (d: number) => {
  return +(d * 1000).toFixed(0);
};

export const timeTo2Digits = (t: number) => {
  const int = Math.floor(t);
  if (int >= 10) return `${int}`;
  return `0${int}`;
};

export const getTime = (timestamp: number) => {
  const d = new Date(timestamp);
  return `${timeTo2Digits(d.getMinutes())}:${timeTo2Digits(d.getSeconds())}`;
};

export const getTimeMMSSFormat = (timestamp: number) => {
  const d = new Date(timestamp * 1000);
  return `${timeTo2Digits(d.getMinutes())}:${timeTo2Digits(d.getSeconds())}`;
};

export const convertToTimestamp = (date: string) => {
  return new Date(date).getTime();
};

export const convertTimestampToStr = (timestamp: number | string) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const convertTimestampWithMonthSrt = (timestamp: number | string) => {
  const dateObj = new Date(timestamp);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${month} ${day}, ${hours < 10 ? '0' + hours : hours}:${formattedMinutes}:${formattedSeconds}`;
};

//
export const convertToCustomFormat = (str: string) => {
  const date = new Date(str);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const getTimezoneOffset = (): string => {
  const offsetMinutes = new Date().getTimezoneOffset();
  const sign = offsetMinutes > 0 ? '-' : '+';
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
