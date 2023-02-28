import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
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

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css'],
  standalone: true,
  imports: [
    NgFor,
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
  ],
})
export class MovieFormComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private store = inject(Store);
  private errorHandler = inject(ErrorHandler);

  movieForm: FormGroup;
  isPremiere: boolean;
  errors: any = {}; // zmien na jakis typ!

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
      ageRestrictions: ['', Validators.maxLength(2)],
      duration: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
      ],
      genres: this.formBuilder.array([
        this.formBuilder.control('', [
          Validators.required,
          Validators.minLength(2),
        ]),
      ]),
      isPremiere: this.formBuilder.control(false, Validators.required),
      image: ['', Validators.required],
    });
  }

  get genres() {
    return this.movieForm.get('genres') as FormArray;
  }

  addGenre() {
    this.genres.push(this.formBuilder.control(''));
  }

  removeGenre(i: number) {
    this.genres.removeAt(i);
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

    window.location.reload();
  }
}
