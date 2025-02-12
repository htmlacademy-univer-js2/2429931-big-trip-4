import { mockRoutePoints, mockOffers, mockDestination } from '../mock/task';

export default class PointModel{
  constructor() {
    this.point = mockRoutePoints;
    this.offer = mockOffers;
    this.destination = mockDestination;
  }

  getPoints(){
    return this.point;
  }

  getOffers(){
    return this.offer;
  }

  getDestinations(){
    return this.destination;
  }
}
