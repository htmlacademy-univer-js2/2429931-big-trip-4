import dayjs from 'dayjs';

const getOfferGivenPointType = (point, offers) => offers.find((o) => o.type.toLowerCase() === point.type.toLowerCase());

const getDestinationGivenPointType = (point, descriptions) => descriptions.find((d) => d.id === point.destination);

const getDestinationByPoint = (inputDestination, destinations) => destinations.find((d) => d.name.toLowerCase() === inputDestination.toLowerCase());

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

const pointTypeIsChecked = (typeCheckbox, typePoint) => typeCheckbox === typePoint.toLowerCase() ? 'checked' : '';

export {getOfferGivenPointType, getDestinationGivenPointType, getDestinationByPoint, getFormatDate, getDiffDate, pointTypeIsChecked};
