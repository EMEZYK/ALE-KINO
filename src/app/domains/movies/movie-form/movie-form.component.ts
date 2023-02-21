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
import { MovieActions } from '../store/repertoire.actions';
import { MatIconModule } from '@angular/material/icon';

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
  ],
})
export class MovieFormComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private store = inject(Store);

  movieForm: FormGroup;
  isPremiere: boolean;

  ngOnInit(): void {
    this.createForm();
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
          Validators.maxLength(50),
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
      genres: this.formBuilder.array([this.formBuilder.control('')]),
      isPremiere: this.formBuilder.control(false),
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

    // console.log(this.movieForm.value);
    // console.log(this.movieForm.getRawValue());

    this.store.dispatch(
      MovieActions.addMovie({
        movie: this.movieForm.getRawValue(),
      })
    );

    this.movieForm.reset();
  }
}

// this.movieForm.controls.title.setValue(
//   this.movieForm.controls.title.value.charAt(0).toUpperCase() + this.movieForm.controls.title.value.slice(1)
// );
