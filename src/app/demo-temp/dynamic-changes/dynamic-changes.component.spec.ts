import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicChangesComponent } from './dynamic-changes.component';

describe('DynamicChangesComponent', () => {
  let component: DynamicChangesComponent;
  let fixture: ComponentFixture<DynamicChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
