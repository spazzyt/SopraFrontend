import { TestBed, inject } from '@angular/core/testing';
import { WSService } from './websocket.service';

describe('WSServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WSService]
    });
  });

  it('should ...', inject([WSService], (service: WSService) => {
    expect(service).toBeTruthy();
  }));
});
