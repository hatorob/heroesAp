import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPagesComponent } from './pages/layout-pages/layout-pages.component';
import { NewPageComponent } from '../heroes/pages/new-page/new-page.component';

// localhost:4200/auth
const routes: Routes = [
  {
    path: '',
    component: LayoutPagesComponent,
    children: [
      {
        path: 'new-hero',
        component: NewPageComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild( routes ),
  ],
  exports: [
    RouterModule
  ],
})
export class AuthRoutingModule { }
