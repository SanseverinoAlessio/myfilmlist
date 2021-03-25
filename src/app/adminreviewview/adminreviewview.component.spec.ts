import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreviewviewComponent } from './adminreviewview.component';

describe('AdminreviewviewComponent', () => {
  let component: AdminreviewviewComponent;
  let fixture: ComponentFixture<AdminreviewviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminreviewviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminreviewviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
