import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsPageComponent } from './seats-page.component';

describe('SeatsPage', () => {
  let component: SeatsPageComponent;
  let fixture: ComponentFixture<SeatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
