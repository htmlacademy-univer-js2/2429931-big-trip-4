import { mockRoutePoints, mockOffers, mockDestinations } from '../mock/task';

export default class PointModel{
  #points = null;
  #offers = null;
  #destinations = null;

  constructor() {
    this.#points = mockRoutePoints;
    this.#offers = mockOffers;
    this.#destinations = mockDestinations;
  }

  get points(){
    return this.#points;
  }

  get offers(){
    return this.#offers;
  }

  get destinations(){
    return this.#destinations;
  }
}
