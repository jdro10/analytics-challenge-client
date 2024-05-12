import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioSpaceComponent } from './scenario-space.component';

describe('ScenarioSpaceComponent', () => {
  let component: ScenarioSpaceComponent;
  let fixture: ComponentFixture<ScenarioSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScenarioSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
