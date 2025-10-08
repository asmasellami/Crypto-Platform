import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerpetualsFilterComponent } from './perpetuals-filter.component';

describe('PerpetualsFilterComponent', () => {
  let component: PerpetualsFilterComponent;
  let fixture: ComponentFixture<PerpetualsFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerpetualsFilterComponent]
    });
    fixture = TestBed.createComponent(PerpetualsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
