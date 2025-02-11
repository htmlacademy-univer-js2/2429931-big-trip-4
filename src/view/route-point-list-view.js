
import { createElement } from '../render';

function createRoutePointListTemplate() {
  return `
    <ul class="trip-events__list"></ul>
  `;
}

export default class RoutePointListView{
  getTemplate(){
    return createRoutePointListTemplate();
  }

  getElement(){
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  deleteElement() {
    this.element = null;
  }
}
