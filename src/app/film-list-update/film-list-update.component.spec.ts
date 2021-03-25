import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmListUpdateComponent } from './film-list-update.component';

describe('FilmListUpdateComponent', () => {
  let component: FilmListUpdateComponent;
  let fixture: ComponentFixture<FilmListUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmListUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmListUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
