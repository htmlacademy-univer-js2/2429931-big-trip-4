import { getOfferGivenPointType, getFormatDate, getDestinationGivenPointType, getDestinationByPoint,pointTypeIsChecked } from '../utils/utils';
import { FORMAT_DATE, TYPES_POINT } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {nanoid} from 'nanoid';
import he from 'he';

const BLANK_POINT = {
  basePrice: 1,
  type: 'flight',
  dateFrom: '2023-07-18T20:20:13.375Z',
  dateTo: '2023-07-18T21:40:13.375Z',
  destination: 1,
  id: nanoid(),
  offers: [],
  isFavorite: false
};

function createOfferTemplate(option, point){
  const {id, price, title} = option;
  const checkedAtribute = (point.offers.includes(id)) ? 'checked' : '';

  return`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage-${id}" ${checkedAtribute}>
      <label class="event__offer-label" for="event-offer-luggage-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
}

function createSectionOffers(point, offers){
  const givenOffer = getOfferGivenPointType(point, offers);
  if(givenOffer === undefined){
    return '';
  }
  return`
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${givenOffer?.offers.map((o) => createOfferTemplate(o, point)).join('')}
    </div>
  </section>`;
}

function createSectionDestinations(point, destinations){
  const givenDestination = getDestinationGivenPointType(point, destinations);
  if(!givenDestination?.description.trim?.()?.length){
    return '';
  }
  let givenPictures = '';
  if(givenDestination?.pictures.length !== 0){
    givenPictures = `
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${givenDestination?.pictures?.map((d) => `<img class="event__photo" src=${d.src} alt="${d.description}">`)}
        </div>
      </div>`;
  }
  return`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(givenDestination?.description)}</p>
      ${givenPictures}
    </section>
  `;
}

function createTypeList(typePoint){
  return`
  <fieldset class="event__type-group">
  <legend class="visually-hidden">Event type</legend>
  ${TYPES_POINT.map((t) => `<div class="event__type-item">
    <input id="event-type-${t}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${t}" ${pointTypeIsChecked(t, typePoint)}>
    <label class="event__type-label  event__type-label--${t}" for="event-type-${t}-1">${t}</label>
  </div>`).join('')}
</fieldset>`;
}

function createEditFormTemplate(point, destinations, offers) {
  const {type, basePrice, dateFrom, dateTo} = point;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${createTypeList(type)}
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${getDestinationGivenPointType(point, destinations)?.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinations.map((dest) => `<option value="${dest.name}">`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormatDate(dateFrom, FORMAT_DATE.dmyTime)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormatDate(dateTo, FORMAT_DATE.dmyTime)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createSectionOffers(point,offers)}
          ${createSectionDestinations(point,destinations)}
        </section>
      </form>
    </li>
  `;
}

export default class EditFormView extends AbstractStatefulView{
  #offers = null;
  #destinations = null;

  #handleSubmitClick = null;
  #handleOnBtnRollClick = null;
  #handleDeleteClick = null;

  #datepicker = null;

  constructor({point = BLANK_POINT, offers, destinations, onSubmitClick, onBtnRollClick, onDeleteClick}){
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleSubmitClick = onSubmitClick;
    this.#handleOnBtnRollClick = onBtnRollClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template(){
    return createEditFormTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement(){
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point){
    this.updateElement(
      EditFormView.parsePointToState(point)
    );
  }

  _restoreHandlers(){
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollButtonHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    if(this.element.querySelector('.event__available-offers') !== null){
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersHandler);
    }
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('[name=event-start-time]').addEventListener('input', this.#timeStartInputHandler);
    this.element.querySelector('[name=event-end-time]').addEventListener('input', this.#timeEndInputHandler);

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = Number(evt.target.name.split('-').at(-1));
    const newOffersIds = this._state.offers;
    if (newOffersIds.includes(clickedOfferId)) {
      newOffersIds.splice(newOffersIds.indexOf(clickedOfferId), 1);
    } else {
      newOffersIds.push(clickedOfferId);
    }
    this._setState({
      offers: newOffersIds
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick(EditFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #timeStartInputHandler = (evt) => {
    evt.preventDefault();
    this.#setDatepickerStart();
  };

  #timeEndInputHandler = (evt) => {
    evt.preventDefault();
    this.#setDatepickerEnd();
  };

  #rollButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleOnBtnRollClick();
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const newDestination = getDestinationByPoint(evt.target.value, this.#destinations);
    const newDestinationId = newDestination ? newDestination.id : null;
    if(newDestinationId !== null){
      this.updateElement({
        destination: newDestinationId ,
      });
    } else {
      this.#isDisabled('.event__input--destination', true, '1px solid red');
    }
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    if(/^\d*[1-9]\d*$/.test(evt.target.value)){
      this._setState({
        basePrice: evt.target.value
      });
      this.#isDisabled('.event__input--price', false, 'none');
    } else {
      this.#isDisabled('.event__input--price', true, '1px solid red');
    }
  };

  #isDisabled = (inputPlace, flag, styleBorder) => {
    if(inputPlace === '.event__input--price'){
      this.element.querySelector('.event__input--destination').disabled = flag;
    } else if(inputPlace === '.event__input--destination'){
      this.element.querySelector('.event__input--price').disabled = flag;
    }
    this.element.querySelector(inputPlace).style.border = styleBorder;
    this.element.querySelector('.event__save-btn').disabled = flag;
    this.element.querySelector('[name="event-start-time"]').disabled = flag;
    this.element.querySelector('[name="event-end-time"]').disabled = flag;
    this.element.querySelector('.event__type-group').disabled = flag;
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: this._state.type === evt.target.value ? this._state.offers : [],
    });
  };

  #dateChangeHandler = (dateType) => ([userDate]) => {
    this.updateElement({
      [dateType]: userDate,
    });
  };

  #setDatepickerStart() {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name=event-start-time]'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        static: true,
        maxDate: this._state.dateTo,
        onChange: this.#dateChangeHandler('dateFrom')
      },
    );
  }

  #setDatepickerEnd() {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name=event-end-time]'),
      {
        dateFormat: 'd/m/Y H:i',
        static: true,
        enableTime: true,
        minDate: this._state.dateFrom,
        onChange: this.#dateChangeHandler('dateTo')
      },
    );
  }

  static parsePointToState(point){
    return {
      ...point,
    };
  }

  static parseStateToPoint(state){
    const point = {...state};
    return point;
  }
}
