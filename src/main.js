import { render } from './framework/render.js';
import RoutePointListPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';
import NewPointButton from './view/new-point-button-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointApiService from './point-api-service.js';

const AUTHORIZATION = 'Basic zdlkkdks1212';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const siteMainElement = document.querySelector('.page-main');
const tripEvents = siteMainElement.querySelector('.trip-events');
const tripControls = document.querySelector('.trip-main');
const tripControlsFilter = document.querySelector('.trip-controls__filters');

const pointsApiService = new PointApiService(END_POINT, AUTHORIZATION);
const pointModel = new PointModel({
  pointsApiService: pointsApiService
});
const filterModel = new FilterModel();
const mainPresenter = new RoutePointListPresenter({
  pointModel,
  tripEvents,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose});
const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilter,
  filterModel,
  pointModel,
});
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

// render(newPointButtonComponent, tripControls);
// filterPresenter.init();
mainPresenter.init();
pointModel.init()
  .finally(() => {
    render(newPointButtonComponent, tripControls);
    filterPresenter.init();
  });
