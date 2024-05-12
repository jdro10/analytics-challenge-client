import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SimulationParametersRequest } from '../models/SimulationParametersRequest';
import { ScenarioSpace } from '../models/ScenarioSpace';
import { SimulationService } from '../services/simulation.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LinearChartComponent } from '../linear-chart/linear-chart.component';
import { Utils } from '../utils/utils';

// asset classes initial allocation default value
const DEFAULT_ASSET_CLASS_VALUE = 10000;

@Component({
  selector: 'app-asset-classes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    SpinnerComponent,
    LinearChartComponent,
  ],
  templateUrl: './asset-classes.component.html',
  styleUrl: './asset-classes.component.css',
})
export class AssetClassesComponent {
  @Output() onLoading = new EventEmitter<boolean>();
  @Output() onSimulation = new EventEmitter<string>();

  // ui state variables
  public isDialogOpen: boolean = false;
  public loadingChart: boolean = false;
  public showLinearChart: boolean = false;

  // input variables from parent component
  @Input() assetClasses: { [key: string]: number } = {};
  @Input() selectedScenarioSpace: string = '';

  public simulationParametersRequest = {} as SimulationParametersRequest;
  public scenarioSpaces: ScenarioSpace = new ScenarioSpace();
  public simulationData: any;

  constructor(
    public dialog: MatDialog,
    private simulationService: SimulationService
  ) {}

  // Dialog shown when user enters invalid input in asset clases (e.g. characters or negative numbers)
  invalidUserInputDialog(assetValue: number | null, key: string): void {
    if ((assetValue == null || isNaN(assetValue) || assetValue < 0) && !this.isDialogOpen) {
      this.isDialogOpen = true;

      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Warning',
          message: `Only positive numeric numbers can be used! Non valid inputs will be converted to the default value of ${DEFAULT_ASSET_CLASS_VALUE}. `,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.isDialogOpen = false;
        // revert to asset class to default value
        this.assetClasses[key] = DEFAULT_ASSET_CLASS_VALUE;
      });
    }
  }

  // This function performs a call to the custom API given the input asset classes
  simulate(): void {
    // ui state flags
    this.loadingChart = true;
    this.onLoading.emit(this.loadingChart);
    this.showLinearChart = false;

    // set asset classes and selected scenario space
    this.simulationParametersRequest = {
      assetClasses: this.assetClasses,
      scenarioSpaceName:
        this.scenarioSpaces.assetClasses[this.selectedScenarioSpace],
      scenarioSpace: this.selectedScenarioSpace,
    };

    // call the API and subscribe the result
    this.simulationService
      .performSimulation(this.simulationParametersRequest)
      .subscribe({
        next: (data) => {
          this.simulationData = data;
          this.onSimulation.emit(this.selectedScenarioSpace);

          if (data !== null) {
            this.showLinearChart = true;
          } else {
            Utils.showDialog(
              'Warning',
              'No data was returned by the API for the given parameters! No chart will be shown. Please try again.',
              this.dialog
            );
          }

          this.loadingChart = false;
          this.onLoading.emit(this.loadingChart);
        },
        error: () => {
          this.loadingChart = false;
          this.onLoading.emit(this.loadingChart);
          Utils.showDialog(
            'Error',
            'Could not establish communication with simulation API.',
            this.dialog
          );
        },
      });
  }
}
