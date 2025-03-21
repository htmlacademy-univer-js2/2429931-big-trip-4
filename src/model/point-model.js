import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointModel extends Observable{
  #points = [];
  #offers = [];
  #destinations = [];

  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();

    this.#pointsApiService = pointsApiService;
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

  async init(){
    try{
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = await this.#pointsApiService.offers;
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1){
      throw new Error('Can\'t update unexisting point');
    }

    try{
      const response = await this.#pointsApiService.updatePoint(update);
      const updatePoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatePoint,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, updatePoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async deletePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1){
      throw new Error('Can\'t delete unexisting point');
    }

    try{
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  async addPoint(updateType, update){
    try{
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [
        newPoint,
        ...this.#points,
      ];

      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
