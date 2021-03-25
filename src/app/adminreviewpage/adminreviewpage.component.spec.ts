import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreviewpageComponent } from './adminreviewpage.component';

describe('AdminreviewpageComponent', () => {
  let component: AdminreviewpageComponent;
  let fixture: ComponentFixture<AdminreviewpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminreviewpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminreviewpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
