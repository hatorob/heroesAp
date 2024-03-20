import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
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

  //! CRUD
  //! add
  /**
   * Esta función se encargara de ingresar un nuevo heroe
   * @param hero -> objeto de hero
   * @returns
   */
  public addHero = (hero: Hero): Observable<Hero> => {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`,hero);
  }

  //! Update
  /**
   * Esta función se encarga de actualizar alguna propiedad de heroes
   * @param hero objeto de hero
   * @returns
   */
  public updateHero = (hero: Hero): Observable<Hero> => {
    if( !hero.id ) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`,hero);
  }

  //! Delete
  /**
   * Esta función se encarga de eliminar heroes
   * @param hero objeto de hero
   * @returns
   */
  public delatedHero = (id: string): Observable<boolean> => {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
                .pipe(
                  catchError( error => of(false)),
                  map( resp => true )
                )
  }

}
