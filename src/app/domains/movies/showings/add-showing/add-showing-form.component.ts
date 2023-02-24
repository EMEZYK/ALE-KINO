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
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { NgFor, NgIf } from '@angular/common';
import { HallStore } from 'src/app/domains/booking/hall/store/hall.store';
import { AsyncPipe } from '@angular/common';
import { ErrorHandler } from 'src/app/shared/validators/error-handler';
import { MatIconModule } from '@angular/material/icon';
import { Hall } from 'src/app/domains/booking/hall';
import { CommonModule } from '@angular/common';

export interface ShowingFormValue {
  date: string;
  hour: string;
  hall: Hall;
  break: number;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    CommonModule,
  ],
  providers: [
    HallStore,
    ErrorHandler,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
})
export class AddShowingFormComponent implements OnInit {
  private hallStore = inject(HallStore);
  private formBuilder = inject(NonNullableFormBuilder);
  private errorHandler = inject(ErrorHandler);

  @Output() addShowing = new EventEmitter<ShowingFormValue>();

  state$ = this.hallStore.state$;
  addShowingForm: FormGroup;
  errors: any = {};
  today = new Date();

  ngOnInit() {
    this.createform();

    this.errorHandler.handleErrors(this.addShowingForm, this.errors);
  }
  private createform() {
    this.addShowingForm = this.formBuilder.group({
      date: ['', Validators.required],
      hour: ['', Validators.required],
      hall: ['', Validators.required],
      break: [15],
    });
  }

  submit() {
    this.addShowingForm.markAllAsTouched();

    if (this.addShowingForm.invalid) {
      return;
    }

    this.addShowing.emit(this.addShowingForm.getRawValue());

    console.log(this.addShowingForm.value);

    this.addShowingForm.reset();
  }
}
