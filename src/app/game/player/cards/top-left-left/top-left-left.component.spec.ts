import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLeftLeftComponent } from './top-left-left.component';

describe('TopLeftLeftComponent', () => {
  let component: TopLeftLeftComponent;
  let fixture: ComponentFixture<TopLeftLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopLeftLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLeftLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
