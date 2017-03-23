import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomRightRightComponent } from './bottom-right-right.component';

describe('BottomRightRightComponent', () => {
  let component: BottomRightRightComponent;
  let fixture: ComponentFixture<BottomRightRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomRightRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomRightRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
