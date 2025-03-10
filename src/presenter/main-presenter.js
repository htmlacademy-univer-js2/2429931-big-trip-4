import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/commons.js';
import { UserAction, UpdateType} from '../const.js';

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

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  get points(){
    return this.#pointModel.point;
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#offers = this.#pointModel.offers;
    this.#destinations = this.#pointModel.destinations;

    this.#renderMain();
  }

  #clearPoints(){
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
  
  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderMain();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this.#clearPoints();
        this.#renderMain();
        break;
    }
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  #handleFavoriteChange = (updatePoint) => {
    this.#points = updateItem(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleViewAction = (actionType, updateType, update) => {
    this.#points = updateItem(this.#points, update);
    this.#pointPresenters.get(update.id).init(update);
    console.log(actionType, updateType, update);
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
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
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
      onDataChange: this.#handleViewAction,
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
