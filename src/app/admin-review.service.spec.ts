import { TestBed } from '@angular/core/testing';

import { AdminReviewServiceService } from './admin-review-service.service';

describe('AdminReviewServiceService', () => {
  let service: AdminReviewServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminReviewServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
