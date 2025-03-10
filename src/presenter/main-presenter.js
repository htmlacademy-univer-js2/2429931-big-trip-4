import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { UserAction, UpdateType, FilterType} from '../const.js';
import NewPointPresenter from './new-point-presenter.js';
import {filter} from '../utils/utils.js';
import NoPointsView from '../view/no-points-view';
import LoadingView from '../view/loading-view.js';

export default class RoutePointListPresenter {
  #pointModel = null;
  #tripEvents = null;
  #filterModel = null;

  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #pointListComponent = new RoutePointListView();
  #sortComponent = new SortView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;

  #points = null;
  #offers = null;
  #destinations = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  constructor({pointModel, tripEvents, filterModel, onNewPointDestroy}){
    this.#pointModel = pointModel;
    this.#tripEvents = tripEvents;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });
  }

  get points(){
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);
    return filteredPoints;
  }

  get offers() {
    return this.#pointModel.offers;
  }

  get destinations() {
    return this.#pointModel.destinations;
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#offers = this.#pointModel.offers;
    this.#destinations = this.#pointModel.destinations;

    this.#renderMain();
  }

  createPoint(){
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#pointModel.offers, this.#pointModel.destinations);
  }

  #clearPoints(){
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort(){
    render(this.#sortComponent, this.#tripEvents);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointsView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#tripEvents);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEvents);
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
    pointPresenter.init(point, this.offers, this.destinations);
    this.#pointPresenters.set(point.id,pointPresenter);
  }

  #renderMain (){
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderAllPoints();
  }
}
