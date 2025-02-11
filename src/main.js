import FilterView from '../src/view/filter-view.js';
import { render } from './render.js';
import RoutePointListPresenter from './presenter/route-point-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsFilters = siteHeaderElement.querySelector('.trip-controls__filters');

render(new FilterView(), tripControlsFilters);

const listPresenter = new RoutePointListPresenter();

listPresenter.init();
