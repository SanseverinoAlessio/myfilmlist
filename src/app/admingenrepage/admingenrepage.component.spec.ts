import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingenrepageComponent } from './admingenrepage.component';

describe('AdmingenrepageComponent', () => {
  let component: AdmingenrepageComponent;
  let fixture: ComponentFixture<AdmingenrepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmingenrepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmingenrepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
