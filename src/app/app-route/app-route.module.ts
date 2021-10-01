import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchPropertiesComponent} from "../components/search-properties/search-properties.component";
import {LoginComponent} from "../components/login/login.component";
import {PropertyDetailsComponent} from "../components/property-details/property-details.component";
import {FavoritesPropertiesComponent} from "../components/favorites-properties/favorites-properties.component";
import {PropertyPerformanceComponent} from "../components/property-performance/property-performance.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "search-properties",
    component: SearchPropertiesComponent
  },
  {
    path: "property-details/:propertyId",
    component: PropertyDetailsComponent
  },
  {
    path: "favorites-properties",
    component: FavoritesPropertiesComponent
  },
  {
    path: "property-performance/:propertyId",
    component: PropertyPerformanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule {
}
