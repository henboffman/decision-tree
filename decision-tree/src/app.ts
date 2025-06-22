import { IRoute, IRouteableComponent } from '@aurelia/router';
import { Home } from './pages/home/home';
import { Workflow } from './pages/workflow/workflow';
import { Forms } from './pages/forms/forms';
import { Settings } from './pages/settings/settings';
import { DecisionTreeIcon } from './components/decision-tree-icon';

export class App implements IRouteableComponent {
  constructor() { }

  static routes: IRoute[] = [
    { id: "home", path: ['', 'home'], component: Home, title: 'Home' },
    { id: "workflow", path: 'workflow', component: Workflow, title: 'Guided Workflow' },
    { id: "forms", path: 'forms', component: Forms, title: 'Forms' },
    { id: "settings", path: 'settings', component: Settings, title: 'Settings' }
  ];

}