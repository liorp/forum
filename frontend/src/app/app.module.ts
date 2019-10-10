import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {RestangularModule, Restangular} from 'ngx-restangular';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost:8000/');
  RestangularProvider.setRequestSuffix('/');
  RestangularProvider.addElementTransformer('auth', true, (auth) => {
    // This will add a method called login that will do a POST to the path login
    // signature is (name, operation, path, params, headers, elementToPost)
    auth.addRestangularMethod('login', 'post', 'login');
    return auth;
  });
  RestangularProvider.addResponseInterceptor((data, operation, what, url, response) => {
    if (data.results) {
      return data.results;
    } else {
      return data;
    }
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    MatSidenavModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
