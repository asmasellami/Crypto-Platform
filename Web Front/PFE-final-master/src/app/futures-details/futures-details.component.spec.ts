import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturesDetailsComponent } from './futures-details.component';

describe('FuturesDetailsComponent', () => {
  let component: FuturesDetailsComponent;
  let fixture: ComponentFixture<FuturesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuturesDetailsComponent]
    });
    fixture = TestBed.createComponent(FuturesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
