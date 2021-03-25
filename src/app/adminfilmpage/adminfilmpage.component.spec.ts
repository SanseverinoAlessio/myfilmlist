import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminfilmpageComponent } from './adminfilmpage.component';

describe('AdminfilmpageComponent', () => {
  let component: AdminfilmpageComponent;
  let fixture: ComponentFixture<AdminfilmpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminfilmpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminfilmpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
