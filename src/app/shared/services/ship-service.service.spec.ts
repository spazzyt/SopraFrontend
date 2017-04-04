import { TestBed, inject } from '@angular/core/testing';
import { ShipServiceService } from './ship-service.service';

describe('ShipServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShipServiceService]
    });
  });

  it('should ...', inject([ShipServiceService], (service: ShipServiceService) => {
    expect(service).toBeTruthy();
  }));
});
