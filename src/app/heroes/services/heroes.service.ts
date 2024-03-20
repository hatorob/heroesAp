import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor( private http: HttpClient) { }

  public getHero = (): Observable<Hero[]> => {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  public getHeroById = (id:string): Observable<Hero | undefined> => {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
                .pipe(
                  catchError( error => of(undefined) )
                );
  }

  /* Autocomplete */

  public getSuggestions = (query: string): Observable<Hero[]> => {

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
              .pipe(
                map( heroes => heroes.filter( ({superhero}) => superhero!.toLowerCase().includes(query.toLowerCase())))
              );
  }

}
