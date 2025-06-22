import { bindable, inject } from 'aurelia';

export class DecisionTreeIcon {
    @bindable size = '24'; // Default size
    @bindable color = 'currentColor'; // Inherits color by default
    @bindable strokeWidth = '4'; // Default stroke width
}