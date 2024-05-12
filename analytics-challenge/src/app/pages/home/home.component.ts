import { Component } from '@angular/core';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { ScenarioSpaceComponent } from '../../scenario-space/scenario-space.component';
import { SimulationStatsComponent } from '../../simulation-stats/simulation-stats.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToolbarComponent, ScenarioSpaceComponent, SimulationStatsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
