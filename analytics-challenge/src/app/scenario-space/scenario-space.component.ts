import { Component } from '@angular/core';
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
  ) {

  }

  // This function retrieves the available asset classes for a specific scenario space
  getAssetClasses(): void {
    // ui state flags
    this.loading = true;
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
        },
        error: () => {
          this.loading = false;
          this.error = true;
          this.showDialog(
            'Error',
            `An unexpected error occurred while attempting to communicate with the API.`
          );
        },
      });
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
