import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchPropertiesComponent} from "../components/search-properties/search-properties.component";
import {LoginComponent} from "../components/login/login.component";
import {PropertyDetailsComponent} from "../components/property-details/property-details.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule {
}
