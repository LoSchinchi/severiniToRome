import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHomePageComponent } from './game-home-page.component';

describe('GameHomePageComponent', () => {
  let component: GameHomePageComponent;
  let fixture: ComponentFixture<GameHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameHomePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
