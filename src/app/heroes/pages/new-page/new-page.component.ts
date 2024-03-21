import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  //! Formularios reactivos declaración - inicio
  public heroForm = new FormGroup({
    id:        new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });
  //! formularios reactivos declaración - fin

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    if( !this.router.url.includes('edit') ) return;
    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById(id) ),
      ).subscribe( hero => {
        if(!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return
      })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public onSubmit = (): void => {

    //! SI el formulario no es valido
    if( this.heroForm.invalid ) return;

    if( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
          .subscribe( hero => {
            this.showSnackbar(`${hero.superhero} updated!`);
          });
      return;
    }

    this.heroesService.addHero(this.currentHero)
        .subscribe( hero => {
          // TODO mostrar snackbar y navegar a /heroes/edit/hero.id
          this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
          this.showSnackbar(`${hero.superhero} created!`);
        });
  }

  public onDeleteHeroConfirmed = (): void => {
    if( !this.currentHero.id ) throw Error('Hero is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    //!Antes
    /*
    dialogRef.afterClosed().subscribe(result => {
      if( !result ) return;

      this.heroesService.delatedHero( this.currentHero.id )
          .subscribe( wasDeleted => {
            if( wasDeleted ) this.router.navigate(['/heroes']);
          });
    }); */
    //! Ahora refactorizado
    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result === true ),
        switchMap( () => this.heroesService.delatedHero(this.currentHero.id) ),
        filter( (wasDeleted: boolean) => wasDeleted)
        //tap( wasDeleted => console.log({wasDeleted})),
        //tap( result => console.log(result))
      )
      .subscribe( result => {
        this.router.navigate(['/heroes']);
      })


  }

  public showSnackbar = (message: string):void => {
    this.snackbar.open(
      message,
      'done',
      {
        duration: 2500
      }
    )
  }

}
