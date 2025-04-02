import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { Film } from '../../../entities/film';
import { FilmsService } from '../../../services/films.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './film-edit.component.html',
  styleUrl: './film-edit.component.css',
})
export default class FilmEditComponent implements OnInit {
  private filmsService = inject(FilmsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  filmForm: FormGroup;
  isEditMode = false;
  filmId?: number;

  constructor() {
    this.filmForm = this.fb.group({
      nazov: ['', Validators.required],
      rok: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      slovenskyNazov: ['', Validators.required],
      imdbID: ['', Validators.required],
      reziser: [[]],
      postava: [[]],
      poradieVRebricku: [{}],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.filmId = +id;
      this.filmsService.getFilm(this.filmId).subscribe({
        next: (film: Film) => {
          this.filmForm.patchValue(film);
        },
        error: (error: any) => {
          this.snackBar.open('Chyba pri načítaní filmu', 'OK', {
            duration: 3000,
          });
          this.router.navigate(['/films']);
        },
      });
    }
  }

  onSubmit() {
    if (this.filmForm.valid) {
      const film: Film = {
        ...this.filmForm.value,
        id: this.filmId,
      };

      const operation = this.isEditMode
        ? this.filmsService.updateFilm(film)
        : this.filmsService.createFilm(film);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            this.isEditMode
              ? 'Film bol úspešne aktualizovaný'
              : 'Film bol úspešne vytvorený',
            'OK',
            { duration: 3000 }
          );
          this.router.navigate(['/films']);
        },
        error: (error) => {
          this.snackBar.open('Chyba pri ukladaní filmu', 'OK', {
            duration: 3000,
          });
        },
      });
    }
  }

  onCancel() {
    this.router.navigate(['/films']);
  }
}
