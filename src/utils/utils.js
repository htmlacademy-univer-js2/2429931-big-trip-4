import dayjs from 'dayjs';
import { FilterType } from '../const';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const getOfferGivenPointType = (point, offers) => offers.find((o) => o.type.toLowerCase() === point.type.toLowerCase());

const getDestinationGivenPointType = (point, descriptions) => descriptions.find((d) => d.id === point.destination);

const getDestinationByPoint = (inputDestination, destinations) => destinations.find((d) => d.name.toLowerCase() === inputDestination.toLowerCase());

const getFormatDate = (date, newFormatDate) => dayjs(date).format(newFormatDate);

const getDiffDate = (start, end) => {

  const days = dayjs(end).diff(dayjs(start),'day');
  const hours = dayjs(end).diff(dayjs(start),'hour') % 24;
  const minute = dayjs(end).diff(dayjs(start),'minute') % 60;

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


function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

function isFuturePoint(date) {
  return dayjs(date).isAfter(new Date(),'day');
}

function isPastPoint(date) {
  return dayjs(date).isBefore(new Date(),'day');
}

function isPresentPoint(dateFrom, dateTo) {
  return dayjs(dateFrom).isSameOrBefore(new Date(),'day') && dayjs(dateTo).isSameOrAfter(new Date(),'day');
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.dateTo)),
};

export {getOfferGivenPointType, getDestinationGivenPointType, getDestinationByPoint, getFormatDate, getDiffDate, pointTypeIsChecked, isDatesEqual, filter};
