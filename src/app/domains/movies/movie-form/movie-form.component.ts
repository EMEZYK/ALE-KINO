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
import { NumberDirective } from 'src/app/shared/directives/numbers-only.directive';
import { MatRadioModule } from '@angular/material/radio';

import { Movie } from '../movie.interface';

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
  ],
})
export class MovieFormComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);

  movieForm: FormGroup;

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.movieForm = this.formBuilder.group({
      title: [
        '',
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
      shortDescription: [
        '',
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(50),
      ],
      longDescription: [
        '',
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(200),
      ],
      ageRestrictions: ['', Validators.maxLength(2)],
      duration: [
        '',
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(3),
      ],
      genres: ['', Validators.required, Validators.minLength(3)],
      // isPremiere: this.isPremiere,
      isPremiere: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  submit() {
    console.log('zatwierdzono');
  }
}

// {
//   "id": 2,
//   "title": "Noc Wigilijna",
//   "duration": 120,
//   "ageRestrictions": "12+",
//   "genres": ["Komedia"],
//   "shortDescription": "Nowa wersja kultowej historii o duchach Charlesa Dickensa autorstwa nominowanego do Oscara Stevena Knighta. Mroczny miniserial prezentuje ciemną stronę duszy Ebenezera Scroogea, w którego postać wciela się Guy Pearce (Memento).",
//   "longDescription": "długi opis filmu",
//   "image": "https://img.freepik.com/free-photo/portrait-excited-girl-3d-glasses_171337-11453.jpg?w=900&t=st=1669125913~exp=1669126513~hmac=c45c7db599cd49bba49e67bede37e4e22c9ad88a4625626a9abfe82f6729f747",
//   "rating": "5/5",
//   "isPremiere": false
// },
