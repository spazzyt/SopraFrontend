import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyDemoComponent } from './lobby-demo.component';

describe('LobbyDemoComponent', () => {
  let component: LobbyDemoComponent;
  let fixture: ComponentFixture<LobbyDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
