import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerpetualsComponent } from './perpetuals.component';

describe('PerpetualsComponent', () => {
  let component: PerpetualsComponent;
  let fixture: ComponentFixture<PerpetualsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerpetualsComponent]
    });
    fixture = TestBed.createComponent(PerpetualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
