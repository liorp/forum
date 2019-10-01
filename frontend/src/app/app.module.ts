import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RestangularModule, Restangular } from 'ngx-restangular';

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl('https://localhost:1337/');
  RestangularProvider.addElementTransformer('user', true, (user) => {
    // This will add a method called login that will do a POST to the path login
    // signature is (name, operation, path, params, headers, elementToPost)

    user.addRestangularMethod('login', 'post', 'login');

    return user;
  });
  // RestangularProvider.setDefaultHeaders({Authorization: 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1'});
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
    RestangularModule.forRoot(RestangularConfigFactory),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
