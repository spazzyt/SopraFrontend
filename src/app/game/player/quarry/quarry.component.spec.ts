import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarryComponent } from './quarry.component';

describe('QuarryComponent', () => {
  let component: QuarryComponent;
  let fixture: ComponentFixture<QuarryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuarryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuarryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
