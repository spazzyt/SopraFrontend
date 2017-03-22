import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomMiddleRightComponent } from './bottom-middle-right.component';

describe('BottomMiddleRightComponent', () => {
  let component: BottomMiddleRightComponent;
  let fixture: ComponentFixture<BottomMiddleRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomMiddleRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomMiddleRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
