import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartingHarbourComponent } from './departing-harbour.component';

describe('DepartingHarbourComponent', () => {
  let component: DepartingHarbourComponent;
  let fixture: ComponentFixture<DepartingHarbourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartingHarbourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartingHarbourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
