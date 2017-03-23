import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRightRightComponent } from './top-right-right.component';

describe('TopRightRightComponent', () => {
  let component: TopRightRightComponent;
  let fixture: ComponentFixture<TopRightRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopRightRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRightRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
