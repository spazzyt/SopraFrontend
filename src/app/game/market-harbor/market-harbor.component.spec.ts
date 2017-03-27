import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketHarborComponent } from './market-harbor.component';

describe('MarketHarborComponent', () => {
  let component: MarketHarborComponent;
  let fixture: ComponentFixture<MarketHarborComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketHarborComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketHarborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
