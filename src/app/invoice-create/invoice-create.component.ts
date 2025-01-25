import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvoiceService } from '../service/invoice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css'],
})
export class InvoiceCreateComponent implements OnInit {
  invoiceForm!: FormGroup;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      invoice_number: ['', Validators.required],
      from_name: ['', Validators.required],
      from_address: ['', Validators.required],
      to_name: ['', Validators.required],
      to_address: ['', Validators.required],
      invoice_date: ['', Validators.required],
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        item_name: ['', Validators.required],
        qty: ['', [Validators.required, Validators.min(1)]],
        rate: ['', [Validators.required, Validators.min(1)]],
        total: ['', Validators.required],
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateInvoiceTotal();
  }

  calculateItemTotal(index: number): number {
    const item = this.items.at(index);
    const qty = item.get('qty')?.value;
    const rate = item.get('rate')?.value;
    const total = qty * rate;
    item.get('total')?.setValue(total);
    this.calculateInvoiceTotal();
    return total;
  }

  calculateInvoiceTotal(): void {
    this.totalAmount = this.items.controls.reduce((sum, item) => {
      return sum + item.get('total')?.value;
    }, 0);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
        (response) => {
          console.log('Invoice created:', response);

          this.snackBar.open('Invoice created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snack-bar-success'],
          });

          this.invoiceForm.reset();
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error creating invoice:', error);
          this.snackBar.open(
            'Error creating invoice. Please try again!',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snack-bar-error'],
            }
          );
        }
      );
    }
  }
}
