import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCalibPageComponent } from './game-calib-page.component';

describe('GameCalibPageComponent', () => {
  let component: GameCalibPageComponent;
  let fixture: ComponentFixture<GameCalibPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameCalibPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCalibPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
