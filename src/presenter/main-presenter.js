import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { UserAction, UpdateType} from '../const.js';
import NewPointPresenter from './new-point-presenter.js';

export default class RoutePointListPresenter {
  #pointModel = null;
  #tripEvents = null;

  #pointListComponent = new RoutePointListView();
  #sortComponent = new SortView();

  #points = null;
  #offers = null;
  #destinations = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  constructor({pointModel, tripEvents, onNewPointDestroy}){
    this.#pointModel = pointModel;
    this.#tripEvents = tripEvents;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });
  }

  get points(){
    return this.#pointModel.points;
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#offers = this.#pointModel.offers;
    this.#destinations = this.#pointModel.destinations;

    this.#renderMain();
  }

  createPoint(){
    this.#newPointPresenter.init(this.#pointModel.offers, this.#pointModel.destinations);
  }

  #clearPoints(){
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints();
        this.#renderMain();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort(){
    render(this.#sortComponent, this.#tripEvents);
  }

  #renderAllPoints(){
    render(this.#pointListComponent, this.#tripEvents);

    this.points.forEach((element) => {
      this.#renderPoint(element);
    });
  }

  #renderPoint(point){
    const pointPresenter = new PointPresenter({
      pointListComponent: this.#pointListComponent,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id,pointPresenter);
  }

  #renderMain (){
    this.#renderSort();
    this.#renderAllPoints();
  }
}
