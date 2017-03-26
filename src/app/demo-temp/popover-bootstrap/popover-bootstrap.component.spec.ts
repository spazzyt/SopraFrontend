import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverBootstrapComponent } from './popover-bootstrap.component';

describe('PopoverBootstrapComponent', () => {
  let component: PopoverBootstrapComponent;
  let fixture: ComponentFixture<PopoverBootstrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverBootstrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
