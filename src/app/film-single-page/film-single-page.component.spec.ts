import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmSinglePageComponent } from './film-single-page.component';

describe('FilmSinglePageComponent', () => {
  let component: FilmSinglePageComponent;
  let fixture: ComponentFixture<FilmSinglePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmSinglePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
