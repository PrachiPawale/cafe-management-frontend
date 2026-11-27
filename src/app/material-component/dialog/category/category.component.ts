
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Output() onAddCategory = new EventEmitter();
  @Output() onEditCategory = new EventEmitter();

  categoryForm!: FormGroup;

  dialogAction = 'Add';
  action = 'Add';
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    if (this.dialogData?.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';

      this.categoryForm.patchValue({
        name: this.dialogData.data.name
      });
    }
  }

  handleSubmit(): void {

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add(): void {

    const data = {
      name: this.categoryForm.value.name
    };

    this.categoryService.add(data).subscribe({

      next: (response: any) => {

        this.responseMessage = response.message;

        this.snackbarService.openSnackBar(
          this.responseMessage,
          'success'
        );

        this.dialogRef.close(true);
        this.onAddCategory.emit();

      },

      error: (error: any) => {

        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }

    });
  }

  edit(): void {

    const data = {
      id: this.dialogData.data.id,
      name: this.categoryForm.value.name
    };

    this.categoryService.update(data).subscribe({

      next: (response: any) => {

        this.responseMessage = response.message;

        this.snackbarService.openSnackBar(
          this.responseMessage,
          'success'
        );

        this.dialogRef.close(true);
        this.onEditCategory.emit();

      },

      error: (error: any) => {

        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }

    });
  }
}