import { TestBed } from '@angular/core/testing';

import { DatafastService } from './datafast.service';

describe('DatafastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatafastService = TestBed.get(DatafastService);
    expect(service).toBeTruthy();
  });
});
