import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor( private http: HttpClient ) { }

  get currentUser():User | undefined {
    if( !this.user ) return undefined;
    //! structuredClone ayuda a ser un clone completo del mismo
    return structuredClone(this.user);
  }




}
