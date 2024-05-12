import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ScenarioSpaceService } from '../services/scenario-space.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ScenarioSpace } from '../models/ScenarioSpace';
import { AssetClassesComponent } from '../asset-classes/asset-classes.component';

@Component({
  selector: 'app-scenario-space',
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    CommonModule,
    SpinnerComponent,
    AssetClassesComponent,
  ],
  templateUrl: './scenario-space.component.html',
  styleUrl: './scenario-space.component.css',
})
export class ScenarioSpaceComponent {
  // emit to parent component about loading operations
  @Output() onLoading = new EventEmitter<boolean>();
  // emit to parent component scenario space number of simulation updates
  @Output() onSimulation = new EventEmitter<string>();

  // asset classes initial allocation default value
  readonly DEFAULT_ASSET_CLASS_VALUE = 10000;

  // ui state flags
  loading: boolean = false;
  error: boolean = false;
  isDialogOpen: boolean = false;

  // data variables
  selectedScenarioSpace: string = '';
  assetClasses: { [key: string]: number } = {};
  scenarioSpaces: ScenarioSpace = new ScenarioSpace();

  constructor(
    private scenarioSpaceService: ScenarioSpaceService,
    public dialog: MatDialog
  ) {}

  // This function retrieves the available asset classes for a specific scenario space
  getAssetClasses(): void {
    // ui state flags
    this.loading = true;
    this.onLoading.emit(this.loading);
    this.error = false;
    this.assetClasses = {};

    // call the API to get the available asset classes
    this.scenarioSpaceService
      .getScenarioSpace(this.selectedScenarioSpace)
      .subscribe({
        next: (data) => {
          try {
            const assetClassesJsonResponse = JSON.parse(JSON.stringify(data));

            Object.keys(assetClassesJsonResponse.asset_classes).forEach(
              (key) => (this.assetClasses[key] = Math.floor(Math.random() * this.DEFAULT_ASSET_CLASS_VALUE) + 1)
            );
          } catch (error) {
            this.error = true;

            this.showDialog(
              'Warning',
              `The selected scenario scene (${this.selectedScenarioSpace}) has no asset classes. Please select a different option.`
            );
          } finally {
            this.loading = false;
            this.onLoading.emit(this.loading);
          }
        },
        error: () => {
          this.loading = false;
          this.onLoading.emit(this.loading);
          this.error = true;

          this.showDialog(
            'Error',
            `An unexpected error occurred while attempting to communicate with the API.`
          );
        },
      });
  }

  // generic dialog with custom title and message
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

  // notify parent about loading operation
  onAssetClassesLoadingEvent(loading: boolean): void {
    this.onLoading.emit(loading);
  }

  // update scenario space number of simulations
  onSimulationPerformed(scenarioSpace: string): void {
    this.onSimulation.emit(scenarioSpace);
  }
}
