import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { OperatorClass } from 'src/app/models/operators.model';
import { OperatorsService } from 'src/app/services/operators.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';

@Component({
  selector: 'app-add-operator',
  templateUrl: './add-operator.component.html',
  styleUrls: ['./add-operator.component.scss'],
})
export class AddOperatorComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  form: FormGroup;
  isFormSubmitted: boolean = false;
  operatorData: OperatorClass = new OperatorClass('', [], []);
  @ViewChild('smallLogo') smallLogoInput: ElementRef | undefined;
  @ViewChild('logo') logoInput: ElementRef | undefined;

  selectedSmallLogo!: File;
  selectedLogo!: File;

  constructor(
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<AddOperatorComponent>,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private operatorService: OperatorsService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    this.form.get(controlName)?.setValue(file);
  }

  onSmallLogoSelected(event: any) {
    this.selectedSmallLogo = event.target.files?.[0];
  }

  onLogoSelected(event: any) {
    this.selectedLogo = event.target.files?.[0];
  }

  submit() {
    this.isFormSubmitted = true;
    this.operatorData.name = this.form.value.name;

    const formData = new FormData();
    formData.append('smallLogo', this.selectedSmallLogo);
    formData.append('logo', this.selectedLogo);

    this.operatorService.post(this.operatorData.name, formData).subscribe({
      next: () => {
        this.isFormSubmitted = false;
        this.closeModal();
        this.sharedService.reloadGrid();
        this.sharedService.openSnackBar(MESSAGE.success_operator);
      },
      error: error => {
        this.isFormSubmitted = false;
        error.errorMessages.forEach((err: any) => {
          err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
      },
    });
  }
}
