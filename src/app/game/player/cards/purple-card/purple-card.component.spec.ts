import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurpleCardComponent } from './purple-card.component';

describe('PurpleCardComponent', () => {
  let component: PurpleCardComponent;
  let fixture: ComponentFixture<PurpleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurpleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurpleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
