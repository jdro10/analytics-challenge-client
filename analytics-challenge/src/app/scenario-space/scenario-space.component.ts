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
import { SimulationParametersRequest } from './../models/SimulationParametersRequest';
import { ScenarioSpace } from '../models/ScenarioSpace';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

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
    MatDividerModule,
    MatListModule,
  ],
  templateUrl: './scenario-space.component.html',
  styleUrl: './scenario-space.component.css',
})
export class ScenarioSpaceComponent {
  // asset classes initial allocation default value
  readonly DEFAULT_ASSET_CLASS_VALUE = 10000;

  // ui state flags
  loading: boolean = false;
  error: boolean = false;
  isDialogOpen: boolean = false;
  loadingChart: boolean = false;
  showLinearChart: boolean = false;

  // data variables
  selectedScenarioSpace: string = '';
  assetClasses: { [key: string]: number } = {};
  scenarioSpaces: ScenarioSpace = new ScenarioSpace();
  simulationData = {};
  simulationParametersRequest = {} as SimulationParametersRequest;
  simulationStats: { [key: string]: number } = {};

  constructor(
    private scenarioSpaceService: ScenarioSpaceService,
    private simulationService: SimulationService,
    public dialog: MatDialog
  ) {
    Object.keys(this.scenarioSpaces.assetClasses).forEach((key) => {
      this.simulationStats[key] = 0;
    });
  }

  // This function retrieves the available asset classes for a specific scenario space
  getAssetClasses(): void {
    // ui state flags
    this.loading = true;
    this.error = false;
    this.showLinearChart = false;
    this.assetClasses = {};

    // call the API to get the available asset classes
    this.scenarioSpaceService
      .getScenarioSpace(this.selectedScenarioSpace)
      .subscribe((data) => {
        try {
          const assetClassesJsonResponse = JSON.parse(JSON.stringify(data));

          Object.keys(assetClassesJsonResponse.asset_classes).forEach(
            (key) => (this.assetClasses[key] = this.DEFAULT_ASSET_CLASS_VALUE)
          );
        } catch (error) {
          this.error = true;
          this.showDialog(
            'Warning',
            `The selected scenario scene (${this.selectedScenarioSpace}) has no asset classes. Please select a different option.`
          );
        } finally {
          this.loading = false;
        }
      });
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

  // Dialog shown when user enters invalid input in asset clases (e.g. characters or negative numbers)
  invalidUserInputDialog(assetValue: number | null, key: string): void {
    if ((assetValue === null || isNaN(assetValue) || assetValue < 0) && !this.isDialogOpen) {
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
