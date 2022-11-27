import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormPageComponent } from './booking-form-page.component';

describe('BookingFormPageComponent', () => {
  let component: BookingFormPageComponent;
  let fixture: ComponentFixture<BookingFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingFormPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
