import dayjs from 'dayjs';

const getOffers = (point, offer) => offer.find((o) => o.type === point.type);

const getDestination = (point, description) => description.find((d) => d.id === point.destination);

const getFormatDate = (date, newFormatDate) => dayjs(date).format(newFormatDate);

const getDiffDate = (start, end) => {
  const days = dayjs(end).diff(dayjs(start),'day');
  const hours = dayjs(end).diff(dayjs(start),'hour') - days * 24;
  const minute = dayjs(end).diff(dayjs(start),'minute') - hours * 60;

  let result = '';
  if (days !== 0) {
    result += `${days}D `;
  }

  if (hours !== 0) {
    result += `${hours}H `;
  }

  if (minute !== 0) {
    result += `${minute}M`;
  }

  return result;
};

export {getOffers, getDestination, getFormatDate, getDiffDate};
