import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../service/invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent implements OnInit {
  invoices = [];
  displayedColumns: string[] = [
    'invoice_number',
    'from_name',
    'to_name',
    'invoice_date',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>(this.invoices);
  searchQuery = '';
  sort: 'ASC' | 'DESC' = 'ASC';
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    const search = this.searchQuery.trim();
    if (search) {
      this.invoiceService
        .searchInvoices(search, this.sort, this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.invoices = response;
          this.dataSource.data = this.invoices;
          this.totalItems = response.length;
        });
    } else {
      this.invoiceService
        .getInvoices(this.sort, this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.invoices = response;
          this.dataSource.data = this.invoices;
          this.totalItems = response.length;
        });
    }
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.loadInvoices();
  }

  sortData(sort: string): void {
    this.sort = sort as 'ASC' | 'DESC';
    this.loadInvoices();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadInvoices();
  }

  viewDetails(invoice: any): void {
    this.router.navigate([`/invoice/${invoice.id}`]);
  }
}
