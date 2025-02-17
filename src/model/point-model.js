import { mockRoutePoints, mockOffers, mockDestinations } from '../mock/task';

export default class PointModel{
  constructor() {
    this.points = mockRoutePoints;
    this.offers = mockOffers;
    this.destinations = mockDestinations;
  }

  getPoints(){
    return this.points;
  }

  getOffers(){
    return this.offers;
  }

  getDestinations(){
    return this.destinations;
  }
}
