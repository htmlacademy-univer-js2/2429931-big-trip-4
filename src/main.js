import FilterView from '../src/view/filter-view.js';
import { render } from './framework/render.js';
import RoutePointListPresenter from './presenter/route-point-presenter.js';
import PointModel from './model/point-model.js';


const siteMainElement = document.querySelector('.page-main');
const tripEvents = siteMainElement.querySelector('.trip-events');

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsFilters = siteHeaderElement.querySelector('.trip-controls__filters');

render(new FilterView(), tripControlsFilters);

const pointModel = new PointModel();
const listPresenter = new RoutePointListPresenter({pointModel, tripEvents});

listPresenter.init();
