import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAlertComponent } from './update-alert.component';

describe('UpdateAlertComponent', () => {
  let component: UpdateAlertComponent;
  let fixture: ComponentFixture<UpdateAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAlertComponent]
    });
    fixture = TestBed.createComponent(UpdateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
