import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GridModal } from '../../../../../models/grid-modal';
import { AudioControllerData } from '../../../../../models/audio-controller';
import { AudioControllerService } from '../../../../../services/audio-controller.service';
import { TranslateService } from '../../../../../services/translate.service';
import { MESSAGE } from '../../../../../utils/messages';
import { SharedService } from '../../../../../services/shared.service';

@Component({
  selector: 'app-edit',
  templateUrl: './audio-controller-edit.component.html',
  styleUrls: ['./audio-controller-edit.component.scss'],
})
export class AudioControllerEditComponent implements OnInit, OnDestroy {
  acForm = this.fb.group({
    name: [this.data.content.name, [Validators.required]],
    enabled: [this.data.content.enabled, [Validators.required]],
  });
  disabled = true;
  private subscription: Subscription = new Subscription();
  constructor(
    private dialogRef: MatDialogRef<AudioControllerEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: GridModal<AudioControllerData>,
    private service: AudioControllerService,
    private translate: TranslateService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.acForm.valueChanges.subscribe(data => {
        this.disabled = JSON.stringify(data) === JSON.stringify(this.data.content);
      }),
    );
  }

  onSubmit() {
    if (this.acForm.valid) {
      this.subscription.add(
        this.service.update(this.data.id, this.acForm.value).subscribe({
          next: () => {
            this.dialogRef.close();
            this.translate.showSuccessMessage(MESSAGE.success_audio_controller_update);
            this.sharedService.reloadGrid();
          },
          error: error =>
            error.errorMessages.forEach((err: any) => {
              err ? this.translate.showMessage(err) : this.translate.showMessage(MESSAGE.error_audio_controller_update);
            }),
        }),
      );
    } else {
      this.acForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
