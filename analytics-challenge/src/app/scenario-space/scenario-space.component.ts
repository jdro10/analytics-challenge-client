import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScenarioSpaceService } from '../services/scenario-space.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

interface ScenarioSpace {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-scenario-space',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    SpinnerComponent,
  ],
  templateUrl: './scenario-space.component.html',
  styleUrl: './scenario-space.component.css',
})
export class ScenarioSpaceComponent {
  scenarioSpaceData: string = '';
  selectedScenarioSpace: string = '';
  loading: boolean = false;
  assets: string[] = [];
  error: boolean = false;

  constructor(private scenarioSpaceService: ScenarioSpaceService) {}

  scenarioSpaces: ScenarioSpace[] = [
    { value: 'default_2c', viewValue: 'CS_EUR (default_2c)' },
    { value: 'dvv_3a', viewValue: 'CS_EUR (dvv_3a)' },
    { value: 'chf_default_3a', viewValue: 'CS_CHF (chf_default_3a)' },
    { value: 'us_default_4b', viewValue: 'CS_USD (us_default_4b)' },
  ];

  getScenarioSpace(): void {
    this.loading = true;
    this.error = false;
    this.assets = [];

    this.scenarioSpaceService
      .getScenarioSpace(this.selectedScenarioSpace)
      .subscribe((data) => {
        try {
          this.scenarioSpaceData = data;
          const jsonData = JSON.parse(JSON.stringify(data));
          this.assets = Object.keys(jsonData.asset_classes);
        } catch (error) {
          this.error = true;
        } finally {
          this.loading = false;
        }
      });
  }
}
