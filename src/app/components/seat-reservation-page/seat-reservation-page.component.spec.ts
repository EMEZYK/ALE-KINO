import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatReservationPageComponent } from './seat-reservation-page.component';

describe('SeatReservationPageComponent', () => {
  let component: SeatReservationPageComponent;
  let fixture: ComponentFixture<SeatReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatReservationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
