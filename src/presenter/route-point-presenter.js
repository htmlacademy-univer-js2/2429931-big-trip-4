import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render } from '../render.js';
import RoutePointView from '../view/route-point-view';
import CreateFormView from '../view/form-create-view.js';
import EditFormView from '../view/form-edit-view.js';

export default class RoutePointListPresenter {
  constructor({pointModel, tripEvents}){
    this.pointModel = pointModel;
    this.tripEvents = tripEvents;
  }

  pointListComponent = new RoutePointListView();

  init(){
    this.point = this.pointModel.getPoints();
    this.offer = this.pointModel.getOffers();
    this.destination = this.pointModel.getDestinations();

    render(new SortView(), this.tripEvents);
    render(this.pointListComponent, this.tripEvents);
    render(new EditFormView({point: this.point[0], offer: this.offer, destination: this.destination}), this.pointListComponent.getElement());

    this.point.forEach((element) => {
      render(new RoutePointView({point: element, offer: this.offer, destination: this.destination}), this.pointListComponent.getElement());
    });

    render(new CreateFormView, this.pointListComponent.getElement());
  }
}
