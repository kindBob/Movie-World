import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films.service';
import { MatPaginator } from '@angular/material/paginator';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { L, P, Q } from '@angular/cdk/keycodes';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../../services/users.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { OMDBService, OMDBMovie } from '../../services/omdb.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-films',
  imports: [MaterialModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export default class FilmsComponent implements AfterViewInit {
  filmsService = inject(FilmsService);
  usersService = inject(UsersService);
  router = inject(Router);
  omdbService = inject(OMDBService);

  columnsToDisplayS = computed(() =>
    this.usersService.loggedUserS()
      ? ['id', 'nazov', 'rok', 'slovenskyNazov', 'afi1998', 'afi2007']
      : ['id', 'nazov', 'rok']
  );
  paginatorS = viewChild.required<MatPaginator>(MatPaginator);
  sortHeaderS = viewChild.required<MatSort>(MatSort);

  orderByS = signal<string | undefined>(undefined);
  descendingS = signal<boolean | undefined>(undefined);
  indexFromS = signal<number | undefined>(0);
  indexToS = signal<number | undefined>(5);
  searchS = signal<string | undefined>(undefined);
  expandedElement: Film | null = null;
  omdbData: { [key: string]: OMDBMovie } = {};

  queryS = computed(
    () =>
      new Query(
        this.orderByS(),
        this.descendingS(),
        this.indexFromS(),
        this.indexToS(),
        this.searchS()
      )
  );

  filmsResource = rxResource({
    request: () => this.queryS(),
    loader: ({ request: query }) =>
      this.filmsService.getFilms(
        query.orderBy,
        query.descending,
        query.indexFrom,
        query.indexTo,
        query.search
      ),
  });

  responseS = this.filmsResource.value;
  filmsS = computed(() => this.responseS()?.items || []);

  constructor() {
    effect(() => {
      const films = this.filmsS();
      films.forEach((film) => {
        if (film.imdbID && !this.omdbData[film.imdbID]) {
          console.log(
            'Fetching OMDB data for film:',
            film.nazov,
            'IMDB ID:',
            film.imdbID
          );
          this.omdbService.getMovieByImdbId(film.imdbID).subscribe({
            next: (omdbMovie) => {
              console.log('Received OMDB data:', omdbMovie);
              this.omdbData[film.imdbID] = omdbMovie;
            },
            error: (error) => {
              console.error('Error fetching OMDB data:', error);
            },
          });
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.paginatorS().page.subscribe((pageEvent) => {
      console.log('Page event', pageEvent);
      this.indexFromS.set(pageEvent.pageIndex * pageEvent.pageSize);
      this.indexToS.set(
        Math.min(
          (pageEvent.pageIndex + 1) * pageEvent.pageSize,
          pageEvent.length
        )
      );
    });
    this.sortHeaderS().sortChange.subscribe((sortEvent) => {
      console.log('Sort header event', sortEvent);
      if (sortEvent.direction === '') {
        this.descendingS.set(undefined);
        this.orderByS.set(undefined);
        return;
      }
      this.descendingS.set(sortEvent.direction === 'desc');
      let column = sortEvent.active;
      if (column === 'afi1998') column = 'poradieVRebricku.AFI 1998';
      if (column === 'afi2007') column = 'poradieVRebricku.AFI 2007';
      this.orderByS.set(column);
      this.paginatorS().firstPage();
    });
  }

  filter(event: any) {
    const filter = (event.target.value as string).trim().toLowerCase();
    this.searchS.set(filter);
    this.paginatorS().firstPage();
  }

  onEditFilm(film: Film) {
    this.router.navigate(['/films/edit', film.id]);
  }

  onNewFilm() {
    this.router.navigate(['/films/new']);
  }

  getOmdbData(film: Film): OMDBMovie | null {
    return film.imdbID ? this.omdbData[film.imdbID] || null : null;
  }

  getDirectorNames(film: Film): string {
    return (
      film.reziser
        ?.map((r) => `${r.krstneMeno} ${r.stredneMeno} ${r.priezvisko}`.trim())
        .join(', ') || ''
    );
  }

  getCharacterNames(film: Film): string {
    return (
      film.postava?.map((p) => `${p.postava} (${p.dolezitost})`).join(', ') ||
      ''
    );
  }
}

class Query {
  constructor(
    public orderBy?: string,
    public descending?: boolean,
    public indexFrom?: number,
    public indexTo?: number,
    public search?: string
  ) {}
}
