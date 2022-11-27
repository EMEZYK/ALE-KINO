import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelPageComponent } from './user-panel-page.component';

describe('UserPanelPageComponent', () => {
  let component: UserPanelPageComponent;
  let fixture: ComponentFixture<UserPanelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPanelPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
