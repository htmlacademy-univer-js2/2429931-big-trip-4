import { getDestinationGivenPointType, getOfferGivenPointType, getFormatDate, getDiffDate} from '../utils/utils';
import { FORMAT_DATE } from '../const';
import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

function createOfferList(option, point){
  const {id,price, title} = option;
  if(point.offers.includes(id)){
    return`
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
  `;
  }
  return '';
}

function createRoutePoint(point, destinations, offers) {
  const {type, basePrice, dateFrom, dateTo} = point;
  const startTime = getFormatDate(dateFrom, FORMAT_DATE.time);
  const endTime = getFormatDate(dateTo, FORMAT_DATE.time);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${getFormatDate(dateFrom, FORMAT_DATE.md)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${getDestinationGivenPointType(point, destinations).name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${getDiffDate(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
           ${getOfferGivenPointType(point, offers) !== undefined ? getOfferGivenPointType(point, offers)?.options.map((o) => createOfferList(o, point)).join('') : ''}
        </ul>
        <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''} " type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class RoutePointView extends AbstractView{
  #point = null;
  #offers = null;
  #destinations = null;
  #onBtnRollClick = null;
  #onFavoriteClick = null;

  constructor({point, offers, destinations, onBtnRollClick, onFavoriteClick}){
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onBtnRollClick = onBtnRollClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', (event) => {
      event.preventDefault();
      this.#onBtnRollClick();
    });
    this.element.querySelector('.event__favorite-btn').addEventListener('click', (event) =>{
      event.preventDefault();
      this.#onFavoriteClick();
    });
  }

  get template(){
    return createRoutePoint(this.#point, this.#destinations, this.#offers);
  }
}
