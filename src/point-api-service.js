import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(point) {
    const adaptedTripPoint = {...point,
      // 'date_from': (point.dateFrom) ? new Date(point.dateFrom).toISOString() : new Date().toISOString,
      // 'date_to': (point.dateFrom) ? new Date(point.dateTo).toISOString() : new Date().toISOString,
      'date_from': (point.dateFrom instanceof Date) ? point.dateFrom.toISOString() : null,
      'date_to': (point.dateTo instanceof Date) ? point.dateTo.toISOString() : null,
      'base_price': Number(point.basePrice),
      'is_favorite': point.isFavorite,
    };

    delete adaptedTripPoint.dateFrom;
    delete adaptedTripPoint.dateTo;
    delete adaptedTripPoint.basePrice;
    delete adaptedTripPoint.offers;
    delete adaptedTripPoint.isFavorite;
    return adaptedTripPoint;
  }
}
