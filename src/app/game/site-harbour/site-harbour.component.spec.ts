import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHarbourComponent } from './site-harbour.component';

describe('SiteHarbourComponent', () => {
  let component: SiteHarbourComponent;
  let fixture: ComponentFixture<SiteHarbourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteHarbourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteHarbourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
