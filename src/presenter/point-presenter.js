import EditFormView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointPresenter{
  #pointListComponent = null;
  #editFormComponent = null;
  #pointItemComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #offers = null;
  #destinations = null;

  #mode = Mode.DEFAULT;

  constructor({pointListComponent, offers, destinations, onDataChange, onModeChange}){
    this.#pointListComponent = pointListComponent;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point){
    this.#point = point;

    const prevEditFormComponent = this.#editFormComponent;
    const prevPointItemComponent = this.#pointItemComponent;

    this.#editFormComponent = new EditFormView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      onSubmitClick: this.#hanleSubmitClick,
      onBtnRollClick: this.#replaceEditOnPoint
    });

    this.#pointItemComponent = new RoutePointView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnRollClick: this.#replacePointOnEdit,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (prevEditFormComponent === null || prevPointItemComponent === null){
      render(this.#pointItemComponent, this.#pointListComponent.element);
      return;
    }

    if(this.#mode === Mode.EDITING){
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointItemComponent, prevPointItemComponent);
    }

    remove(prevEditFormComponent);
    remove(prevPointItemComponent);

  }

  destroy() {
    remove(this.#pointItemComponent);
    remove(this.#editFormComponent);
  }

  #hanleSubmitClick = (update) => {
    // const isMinorUpdate = !isDatesEqual(this.#point.dateFrom, update.dateFrom) || !isDatesEqual(this.#point.dateTo, update.dateTo);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      // isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      UpdateType.MINOR,
      update);
    this.#replaceEditOnPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite});
    // this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onEscKeydown = (event) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      event.preventDefault();
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditOnPoint();
    }
  };

  #replacePointOnEdit = () => {
    replace(this.#editFormComponent, this.#pointItemComponent);
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#editFormComponent.reset(this.#point);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditOnPoint = () => {
    replace(this.#pointItemComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
  };

  resetView(){
    if(this.#mode !== Mode.DEFAULT){
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditOnPoint();
    }
  }
}
