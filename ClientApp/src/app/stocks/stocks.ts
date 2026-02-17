import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StocksService } from '../stocks-service';

import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipModule } from 'primeng/chip'; // ✅ ADD THIS

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    InputTextModule,
    PopoverModule,
    DatePickerModule,
    ChipModule   // ✅ ADD THIS
  ],
  templateUrl: './stocks.html'
})
export class Stocks implements OnInit {

  @ViewChild('table') table!: Table;

  loading = false;
  stocks: any[] = [];
  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;

  dateRange: Date[] | null = null;
  maxDate: Date = new Date();
  symbol: string = '';
  searchTimeout: any;

  constructor(private stocksService: StocksService) {}

  ngOnInit() {}

  loadStocksLazy(event: any) {

    this.loading = true;

    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    const filter = {
      symbol: this.symbol || null,
      fromDate: this.dateRange ? this.dateRange[0] : null,
      toDate: this.dateRange ? this.dateRange[1] : null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.stocksService.getFilteredStocks(filter)
      .subscribe({
        next: (res) => {
          this.stocks = res.data;
          this.totalRecords = res.totalCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  applyFilters() {
    this.table.reset();
  }

  clearDateFilter() {
    this.dateRange = null;
    this.table.reset();
  }

  clearFilters() {
    this.dateRange = null;
    this.symbol = '';
    this.table.reset();
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.table.reset();   // ✅ FIXED
    }, 400);
  }
}
