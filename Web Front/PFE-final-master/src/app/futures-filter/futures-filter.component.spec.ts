import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturesFilterComponent } from './futures-filter.component';

describe('FuturesFilterComponent', () => {
  let component: FuturesFilterComponent;
  let fixture: ComponentFixture<FuturesFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuturesFilterComponent]
    });
    fixture = TestBed.createComponent(FuturesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
