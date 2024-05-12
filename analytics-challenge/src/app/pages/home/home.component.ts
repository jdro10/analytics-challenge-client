import { Component } from '@angular/core';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { ScenarioSpaceComponent } from '../../scenario-space/scenario-space.component';
import { SimulationStatsComponent } from '../../simulation-stats/simulation-stats.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { CommonModule } from '@angular/common';

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

  onLoadingEvent(loading: boolean): void {
    this.loading = loading;
  }
}
