import { TestBed, inject } from '@angular/core/testing';
import { ActivePlayerService } from './active-player.service';

describe('ActivePlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivePlayerService]
    });
  });

  it('should ...', inject([ActivePlayerService], (service: ActivePlayerService) => {
    expect(service).toBeTruthy();
  }));
});
