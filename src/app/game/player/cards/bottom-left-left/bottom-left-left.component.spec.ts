import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomLeftLeftComponent } from './bottom-left-left.component';

describe('BottomLeftLeftComponent', () => {
  let component: BottomLeftLeftComponent;
  let fixture: ComponentFixture<BottomLeftLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomLeftLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomLeftLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
