import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomMiddleLeftComponent } from './bottom-middle-left.component';

describe('BottomMiddleLeftComponent', () => {
  let component: BottomMiddleLeftComponent;
  let fixture: ComponentFixture<BottomMiddleLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomMiddleLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomMiddleLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
