import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingfieldComponent } from './playingfield.component';

describe('PlayingfieldComponent', () => {
  let component: PlayingfieldComponent;
  let fixture: ComponentFixture<PlayingfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayingfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayingfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
