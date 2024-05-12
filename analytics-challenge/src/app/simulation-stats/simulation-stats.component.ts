import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ScenarioSpace } from '../models/ScenarioSpace';

@Component({
  selector: 'app-simulation-stats',
  standalone: true,
  imports: [MatDividerModule, MatListModule, CommonModule],
  templateUrl: './simulation-stats.component.html',
  styleUrl: './simulation-stats.component.css'
})
export class SimulationStatsComponent {
  @Input() simulationStats: { [key: string]: number } = {};
}
