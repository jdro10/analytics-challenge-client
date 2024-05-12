import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SimulationParametersRequest } from '../models/SimulationParametersRequest';
import { ScenarioSpace } from '../models/ScenarioSpace';
import { SimulationService } from '../services/simulation.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LinearChartComponent } from '../linear-chart/linear-chart.component';
import { SimulationStatsComponent } from '../simulation-stats/simulation-stats.component';


@Component({
  selector: 'app-asset-classes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    SpinnerComponent,
    LinearChartComponent,
    SimulationStatsComponent
  ],
  templateUrl: './asset-classes.component.html',
  styleUrl: './asset-classes.component.css',
})
export class AssetClassesComponent {
  // asset classes initial allocation default value
  readonly DEFAULT_ASSET_CLASS_VALUE = 10000;

  // ui state variables
  isDialogOpen: boolean = false;
  loadingChart: boolean = false;
  showLinearChart: boolean = false;

  @Input() simulationData: any;
  @Input() assetClasses: { [key: string]: number } = {};
  @Input() selectedScenarioSpace: string = '';

  simulationParametersRequest = {} as SimulationParametersRequest;
  scenarioSpaces: ScenarioSpace = new ScenarioSpace();

  simulationStats: { [key: string]: number } = {};

  constructor(
    public dialog: MatDialog,
    private simulationService: SimulationService
  ) {
    Object.keys(this.scenarioSpaces.assetClasses).forEach((key) => {
      this.simulationStats[key] = 0;
    });
  }

  // Dialog shown when user enters invalid input in asset clases (e.g. characters or negative numbers)
  invalidUserInputDialog(assetValue: number | null, key: string): void {
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

      // revert to asset class to default value
      this.assetClasses[key] = this.DEFAULT_ASSET_CLASS_VALUE;

      dialogRef.afterClosed().subscribe(() => {
        this.isDialogOpen = false;
      });
    }
  }

  // This function performs a call to the custom API given the input asset classes
  simulate(): void {
    // ui state flags
    this.loadingChart = true;
    this.showLinearChart = false;

    // set asset classes and selected scenario space
    this.simulationParametersRequest = {
      assetClasses: this.assetClasses,
      scenarioSpace:
        this.scenarioSpaces.assetClasses[this.selectedScenarioSpace],
    };

    // call the API and subscribe the result
    this.simulationService
      .performSimulation(this.simulationParametersRequest)
      .subscribe(
        (data) => {
          this.simulationData = data;
          this.simulationStats[this.selectedScenarioSpace] += 1;

          if (data !== null) {
            this.showLinearChart = true;
          } else {
            this.showDialog(
              'Warning',
              'No data was returned by the API for the given parameters! No chart will be shown. Please try again.'
            );
          }

          this.loadingChart = false;
        },
        () => {
          this.loadingChart = false;
          this.showDialog(
            'Error',
            'Could not establish communication with simulation API.'
          );
        }
      );
  }

  // Generic dialog with custom title and message
  showDialog(title: string, message: string): void {
    this.isDialogOpen = true;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
    });
  }
}
