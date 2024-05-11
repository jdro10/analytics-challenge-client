import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScenarioSpaceService } from '../services/scenario-space.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { SimulationService } from '../services/simulation.service';
import { LinearChartComponent } from '../linear-chart/linear-chart.component';
import { ScenarioSpaces } from '../models/ScenarioSpaces';
import { SimulationParametersRequest } from './../models/SimulationParametersRequest';

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
    MatButtonModule,
    LinearChartComponent,
  ],
  templateUrl: './scenario-space.component.html',
  styleUrl: './scenario-space.component.css',
})
export class ScenarioSpaceComponent {
  readonly DEFAULT_ASSET_CLASS_VALUE = 10000;

  selectedScenarioSpace: string = '';
  loading: boolean = false;
  error: boolean = false;
  assetsDictionary: { [key: string]: number } = {};
  isDialogOpen: boolean = false;
  simulationData: any;
  loadingChart: boolean = false;
  showLinearChart: boolean = false;
  simulationParametersRequest: SimulationParametersRequest;

  constructor(
    private scenarioSpaceService: ScenarioSpaceService,
    private simulationService: SimulationService,
    public dialog: MatDialog
  ) {
    this.simulationParametersRequest = {
      assetClasses: {},
      scenarioSpace: '',
    };
  }

  scenarioSpaces: ScenarioSpace[] = [
    { value: ' ', viewValue: ' ' },
    { value: 'default_2c', viewValue: 'CS_EUR (default_2c)' },
    { value: 'dvv_3a', viewValue: 'CS_EUR (dvv_3a)' },
    { value: 'chf_default_3a', viewValue: 'CS_CHF (chf_default_3a)' },
    { value: 'us_default_4b', viewValue: 'CS_USD (us_default_4b)' },
  ];

  getScenarioSpace(): void {
    this.loading = true;
    this.error = false;
    this.assetsDictionary = {};
    this.showLinearChart = false;

    this.scenarioSpaceService
      .getScenarioSpace(this.selectedScenarioSpace)
      .subscribe((data) => {
        try {
          const jsonData = JSON.parse(JSON.stringify(data));

          Object.keys(jsonData.asset_classes).forEach(
            (key) =>
              (this.assetsDictionary[key] = this.DEFAULT_ASSET_CLASS_VALUE)
          );
        } catch (error) {
          this.error = true;
          this.showWarningDialog();
        } finally {
          this.loading = false;
        }
      });
  }

  showWarningDialog() {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Warning',
        message: `The selected scenario scene (${this.selectedScenarioSpace}) has no asset classes. Please select a different option.`,
      },
    });
  }

  validateInput(assetValue: number | null, key: string): void {
    if (
      (assetValue === null || isNaN(assetValue) || assetValue < 0) &&
      !this.isDialogOpen
    ) {
      this.isDialogOpen = true;

      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Warning',
          message: `Only positive numeric numbers can be used! Non valid inputs will be converted to the default value of ${this.DEFAULT_ASSET_CLASS_VALUE}. `,
        },
      });

      this.assetsDictionary[key] = this.DEFAULT_ASSET_CLASS_VALUE;

      dialogRef.afterClosed().subscribe(() => {
        this.isDialogOpen = false;
      });
    }
  }

  noChartDataDialog(): void {
    this.isDialogOpen = true;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Warning',
        message: `No data was returned by the API for the given parameters! No chart will be shown. Please try again.`,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
    });
  }

  simulate(): void {
    this.loadingChart = true;
    this.showLinearChart = false;

    this.simulationParametersRequest = {
      assetClasses: this.assetsDictionary,
      scenarioSpace: new ScenarioSpaces().assetsDictionary[
        this.selectedScenarioSpace
      ],
    };

    this.simulationService
      .performSimulation(this.simulationParametersRequest)
      .subscribe((data) => {
        this.simulationData = data;

        if (data !== null) {
          this.showLinearChart = true;
        } else {
          this.noChartDataDialog();
        }

        this.loadingChart = false;
      });
  }
}
