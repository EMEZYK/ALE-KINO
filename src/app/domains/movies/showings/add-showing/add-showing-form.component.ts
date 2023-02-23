import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { NgFor, NgIf } from '@angular/common';
import { HallStore } from 'src/app/domains/booking/hall/store/hall.store';
import { AsyncPipe } from '@angular/common';
import { ErrorHandler } from 'src/app/shared/validators/error-handler';
import { MatIconModule } from '@angular/material/icon';

export interface ShowingFormValue {
  date: string;
  timeFrom: string;
  hallId: number;
  movieId: number;
}

@Component({
  selector: 'app-add-showing-form',
  templateUrl: './add-showing-form.component.html',
  styleUrls: ['./add-showing-form.component.css'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule,
    MatSelectModule,
    NgFor,
    MatButtonModule,
    AsyncPipe,
    MatIconModule,
    NgIf,
  ],
  providers: [HallStore, ErrorHandler],
})
export class AddShowingFormComponent implements OnInit {
  private hallStore = inject(HallStore);
  private formBuilder = inject(NonNullableFormBuilder);
  private errorHandler = inject(ErrorHandler);

  @Output() addShowing = new EventEmitter<ShowingFormValue>();

  state$ = this.hallStore.state$;
  addShowingForm: FormGroup;
  errors: any = {};

  ngOnInit() {
    this.createform();

    this.errorHandler.handleErrors(this.addShowingForm, this.errors);
  }
  private createform() {
    this.addShowingForm = this.formBuilder.group({
      date: ['', Validators.required],
      hour: ['', Validators.required],
      hall: ['', Validators.required],
    });
  }

  submit() {
    this.addShowingForm.markAllAsTouched();

    if (this.addShowingForm.invalid) {
      return;
    }

    // console.log(this.addShowingForm.value);
    this.addShowingForm.reset();
  }
}
