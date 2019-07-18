import { Route } from '@angular/router';

import { ResultComponent } from './result.component';

export const MODEL_ROUTE: Route = {
    path: 'result',
    component: ResultComponent,
    data: {
        pageTitle: 'home.title'
    }
};
