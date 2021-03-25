import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedListComponent } from './planned-list.component';

describe('PlannedListComponent', () => {
  let component: PlannedListComponent;
  let fixture: ComponentFixture<PlannedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
