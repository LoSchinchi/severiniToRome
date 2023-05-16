import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePianoPageComponent } from './game-piano-page.component';

describe('GamePianoPageComponent', () => {
  let component: GamePianoPageComponent;
  let fixture: ComponentFixture<GamePianoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamePianoPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePianoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
