import { Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { DemoComponent } from './demo/demo.component';
import {HomeThirteenComponent} from './shop/home-13/home-thirteen.component'
import { SampleComponent} from './sample/sample.component';


export const rootRouterConfig: Routes = [
  /*{
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'demo',
    component: DemoComponent
  },*/
  {
    path: 'sample',
    component: SampleComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { 
        path: '',
        component: HomeThirteenComponent,
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
      }
    ]
  },
  {
    path: 'index',
    redirectTo: ''
  },
  {
    path: '**',
    redirectTo: ''
  }
];

