import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewsHeaderComponent } from './user-reviews-header.component';

describe('UserReviewsHeaderComponent', () => {
  let component: UserReviewsHeaderComponent;
  let fixture: ComponentFixture<UserReviewsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReviewsHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReviewsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
