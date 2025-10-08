import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerpetualsDetailsComponent } from './perpetuals-details.component';

describe('PerpetualsDetailsComponent', () => {
  let component: PerpetualsDetailsComponent;
  let fixture: ComponentFixture<PerpetualsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerpetualsDetailsComponent]
    });
    fixture = TestBed.createComponent(PerpetualsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
