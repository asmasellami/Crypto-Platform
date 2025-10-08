import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsDetailsComponent } from './options-details.component';

describe('OptionsDetailsComponent', () => {
  let component: OptionsDetailsComponent;
  let fixture: ComponentFixture<OptionsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionsDetailsComponent]
    });
    fixture = TestBed.createComponent(OptionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
