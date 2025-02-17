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
    this.points = this.pointModel.getPoints();
    this.offers = this.pointModel.getOffers();
    this.destinations = this.pointModel.getDestinations();

    render(new SortView(), this.tripEvents);
    render(this.pointListComponent, this.tripEvents);
    render(new EditFormView({point: this.points[0], offers: this.offers, destinations: this.destinations}), this.pointListComponent.getElement());

    this.points.forEach((element) => {
      render(new RoutePointView({point: element, offers: this.offers, destinations: this.destinations}), this.pointListComponent.getElement());
    });

    render(new CreateFormView, this.pointListComponent.getElement());
  }
}
