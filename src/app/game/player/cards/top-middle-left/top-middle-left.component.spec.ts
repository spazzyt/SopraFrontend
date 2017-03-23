import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMiddleLeftComponent } from './top-middle-left.component';

describe('TopMiddleLeftComponent', () => {
  let component: TopMiddleLeftComponent;
  let fixture: ComponentFixture<TopMiddleLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMiddleLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMiddleLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
