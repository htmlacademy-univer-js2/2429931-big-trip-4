import FilterView from '../src/view/filter-view.js';
import { render } from './framework/render.js';
import RoutePointListPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';
import NewPointButton from './view/new-point-button-view.js';


const siteMainElement = document.querySelector('.page-main');
const tripEvents = siteMainElement.querySelector('.trip-events');
const tripControls = document.querySelector('.trip-main');


const siteHeaderElement = document.querySelector('.page-header');
const tripControlsFilters = siteHeaderElement.querySelector('.trip-controls__filters');

render(new FilterView(), tripControlsFilters);

const pointModel = new PointModel();
const mainPresenter = new RoutePointListPresenter({
  pointModel,
  tripEvents,
  onNewPointDestroy: handleNewPointFormClose});
const newPointButtonComponent = new NewPointButton({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, tripControls);
mainPresenter.init();
