import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/commons.js';

export default class RoutePointListPresenter {
  #pointModel = null;
  #tripEvents = null;

  #pointListComponent = new RoutePointListView();
  #sortComponent = new SortView();

  #points = null;
  #offers = null;
  #destinations = null;

  #pointPresenters = new Map();

  constructor({pointModel, tripEvents}){
    this.#pointModel = pointModel;
    this.#tripEvents = tripEvents;
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#offers = this.#pointModel.offers;
    this.#destinations = this.#pointModel.destinations;

    this.#renderMain();
  }

  #handleFavoriteChange = (updatePoint) => {
    this.#points = updateItem(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort(){
    render(this.#sortComponent, this.#tripEvents);
  }

  #renderAllPoints(){
    render(this.#pointListComponent, this.#tripEvents);

    this.#points.forEach((element) => {
      this.#renderPoint(element);
    });
  }

  #renderPoint(point){
    const pointPresenter = new PointPresenter({
      pointListComponent: this.#pointListComponent,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handleFavoriteChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id,pointPresenter);
  }

  #renderMain = () => {
    this.#renderSort();
    this.#renderAllPoints();
  };
}
