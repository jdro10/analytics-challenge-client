import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { lastValueFrom } from 'rxjs';

export class Utils {
  static async showDialog(
    title: string,
    message: string,
    dialog: MatDialog
  ): Promise<boolean> {
    const dialogRef = dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
      },
    });

    const result = await lastValueFrom(dialogRef.afterClosed());

    return result ? false : true;
  }
}
