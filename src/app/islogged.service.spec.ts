import { TestBed } from '@angular/core/testing';

import { IsloggedService } from './islogged.service';

describe('IsloggedService', () => {
  let service: IsloggedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsloggedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
