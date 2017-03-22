import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTempComponent } from './demo-temp.component';

describe('DemoTempComponent', () => {
  let component: DemoTempComponent;
  let fixture: ComponentFixture<DemoTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
