import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import { render, replace } from '../framework/render.js';
import EditFormView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view';

export default class RoutePointListPresenter {
  #pointModel = null;
  #tripEvents = null;

  #pointListComponent = new RoutePointListView();

  #points = null;
  #offers = null;
  #destinations = null;

  constructor({pointModel, tripEvents}){
    this.#pointModel = pointModel;
    this.#tripEvents = tripEvents;
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#offers = this.#pointModel.offers;
    this.#destinations = this.#pointModel.destinations;

    render(new SortView(), this.#tripEvents);
    render(this.#pointListComponent, this.#tripEvents);

    this.#points.forEach((element) => {
      this.#renderPoint(element);
    });
  }

  #renderPoint(point){
    const onEscKeydown = (event) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        event.preventDefault();

        replaceEditOnPoint();
      }
    };

    const editForm = new EditFormView({point, destinations: this.#destinations, offers: this.#offers,
      onClickSubmit: replaceEditOnPoint,
      onClickBtnRoll: replaceEditOnPoint
    });

    const pointItem = new RoutePointView({point, destinations: this.#destinations, offers: this.#offers,
      onClickBtnRoll: replacePointOnEdit
    });

    function replacePointOnEdit() {
      replace(editForm, pointItem);
      document.addEventListener('keydown', onEscKeydown);
    }

    function replaceEditOnPoint() {
      replace(pointItem, editForm);
      document.removeEventListener('keydown', onEscKeydown);
    }

    render(pointItem, this.#pointListComponent.element);
  }
}
