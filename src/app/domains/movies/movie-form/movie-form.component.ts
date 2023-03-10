import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { NoWhiteSpaceDirective } from 'src/app/shared/directives/no-white-space.directive';
import { NumberDirective } from 'src/app/shared/directives/numbers-only.directive';
import { Store } from '@ngrx/store';
import { MovieActions } from '../store/movie.actions';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { ErrorHandler } from 'src/app/shared/validators/error-handler';
import { JsonPipe } from '@angular/common';
import { ShowingsListComponent } from '../showings/showings-list/showings-list.component';
import { URL_REGEXP } from 'src/app/shared/validators';
import { MovieGenresApiService } from '../movie-genres/movie-genres.api.service';
import { AsyncPipe } from '@angular/common';
import { AgeRestrictionApiService } from '../age-restrictions/age-restrictions.api.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    NumberDirective,
    MatRadioModule,
    NoWhiteSpaceDirective,
    MatIconModule,
    JsonPipe,
    NgIf,
    ShowingsListComponent,
    AsyncPipe,
    NgFor,
    MatSelectModule,
  ],
})
export class MovieFormComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private store = inject(Store);
  private errorHandler = inject(ErrorHandler);

  movieGenres$ = inject(MovieGenresApiService).getMovieGenres$();
  ageRestrictions$ = inject(AgeRestrictionApiService).getAgeRestrictions$();

  movieForm: FormGroup;
  isPremiere: boolean;
  errors: any = {};
  URL_PATTERN = URL_REGEXP;

  ngOnInit(): void {
    this.createForm();

    this.errorHandler.handleErrors(this.movieForm, this.errors);
  }

  private createForm() {
    this.movieForm = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      shortDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(100),
        ],
      ],
      longDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(200),
        ],
      ],
      ageRestrictions: this.formBuilder.control('', Validators.required),
      duration: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
      ],
      genres: this.formBuilder.control([], Validators.required),
      isPremiere: ['', this.formBuilder.control(false, Validators.required)],
      image: ['', [Validators.required, Validators.pattern]],
    });
  }

  onSelectionChange(event) {
    this.movieForm.get('genres').setValue(event.value);
  }

  onAgeRestrictionsChange(event) {
    this.movieForm.get('ageRestrictions').setValue(event.value);
  }

  submit() {
    this.movieForm.markAllAsTouched();

    if (this.movieForm.invalid) {
      return;
    }

    this.store.dispatch(
      MovieActions.addMovie({
        movie: this.movieForm.getRawValue(),
      })
    );

    this.movieForm.reset();

    // window.location.reload();
  }
}
