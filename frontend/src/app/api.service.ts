import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest, HttpResponse, HttpXhrBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends HttpClient {
  getUsersOfMador(mador: string) {
    // TODO: Implement this
    return (res: Response) => {
      return {
        user_1: [],
        user_2: []
      };
    };
  }

  createRequestOptions(request: HttpRequest<JSON>, contentType: string) {
    const token: string = localStorage.getItem('Token');
    request.headers.append('Content-Type', contentType);
    request.headers.append('Authorization', token);
  }

  authenticate() {
    // TODO: Implement this w/ NTLM
    // Get the user's token
    return (res: Response) => {
      return 'fake_token';
    };
  }
}
