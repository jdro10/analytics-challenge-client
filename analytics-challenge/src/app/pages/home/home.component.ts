import { Component } from '@angular/core';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { ScenarioSpaceComponent } from '../../scenario-space/scenario-space.component';
import { SimulationStatsComponent } from '../../simulation-stats/simulation-stats.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { ScenarioSpace } from '../../models/ScenarioSpace';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ToolbarComponent,
    ScenarioSpaceComponent,
    SimulationStatsComponent,
    SpinnerComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  loading: boolean = false;
  simulationStats: { [key: string]: number } = {};
  scenarioSpaces: ScenarioSpace = new ScenarioSpace();

  constructor() {
    Object.keys(this.scenarioSpaces.assetClasses).forEach((key) => {
      this.simulationStats[key] = 0;
    });
  }

  onLoadingEvent(loading: boolean): void {
    this.loading = loading;
  }

  // update number of simulations for a given scenario space
  onSimulationPerformed(scenarioSpace: string): void {
    this.simulationStats[scenarioSpace] += 1;
  }
}
