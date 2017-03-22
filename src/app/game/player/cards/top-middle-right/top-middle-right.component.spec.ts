import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMiddleRightComponent } from './top-middle-right.component';

describe('TopMiddleRightComponent', () => {
  let component: TopMiddleRightComponent;
  let fixture: ComponentFixture<TopMiddleRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMiddleRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMiddleRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
