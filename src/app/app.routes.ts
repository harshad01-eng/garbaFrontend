import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormDetailComponent } from './form-detail/form-detail.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { AccessGuard } from './auth.guard';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path:'form',
        component: FormViewerComponent
    },
    {
        path:'edit/:id',
        component: FormViewerComponent,
        canActivate:[AccessGuard]
    },
    {
        path:'detail',
        component: FormDetailComponent
    },
    {
        path:'view/:id',
        component: FormDetailComponent,
        canActivate:[AccessGuard]
    },
    {
        path:'admin',
        component: DataGridComponent
    }
];
