import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render } from '../render.js';
import RoutePointView from '../view/route-point-view';
import CreateFormView from '../view/form-create-view.js';
import EditFormView from '../view/form-edit-view.js';

export default class RoutePointListPresenter {
  pointListComponent = new RoutePointListView();

  siteMainElement = document.querySelector('.page-main');
  tripEvents = this.siteMainElement.querySelector('.trip-events');

  init(){
    render(new SortView(), this.tripEvents);
    render(this.pointListComponent, this.tripEvents);
    render(new EditFormView(), this.pointListComponent.getElement());

    for (let i = 0; i < 3; i++){
      render(new RoutePointView(), this.pointListComponent.getElement());
    }

    render(new CreateFormView, this.pointListComponent.getElement());
  }
}
