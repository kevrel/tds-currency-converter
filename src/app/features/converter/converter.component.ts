import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyOption, CurrencyService } from '../../services/currency.service';
import { CurrencyInputComponent } from "../../components/currency-input/currency-input.component";
import { CurrencySelectComponent } from "../../components/currency-select/currency-select.component";

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputComponent, CurrencySelectComponent],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit {
  currencies: CurrencyOption[] = [];
  fromCode = 'GBP';
  toCode = 'EUR';
  amount = 1;
  result: number | null = null;
  baseResult: number | null = null;
  loadingCurrencies = false;
  converting = false;
  error: string | null = null;
  baseError: string | null = null;

  constructor(private readonly currencyService: CurrencyService) {}

  ngOnInit(): void {
    // Load dropdown values and base conversion for 1 unit
    this.loadCurrencies();
    this.convertBase();
  }

  // Stores amount to change
  onAmountChange(value: number): void {
    this.amount = value;
  }

  // Stores currency to convert from and recalculates base conversion for 1 unit
  onFromChange(value: string): void {
    this.fromCode = value;
    this.convertBase();
    this.result = null;
  }

  // Stores currency to convert to and recalculates base conversion for 1 unit
  onToChange(value: string): void {
    this.toCode = value;
    this.convertBase();
    this.result = null;
  }

  // Switches the from and to currencies to convert from and recalculates base conversion
  swap(): void {
    const f = this.fromCode;
    this.fromCode = this.toCode;
    this.toCode = f;
    this.result = null;
    this.convertBase();
  }

  // Fired on page load, calls currency service to retrive currency list
  loadCurrencies(): void {
    this.loadingCurrencies = true;
    this.error = null;
    this.currencyService.getCurrencies().subscribe({
      next: (list) => {
        this.currencies = list;
        if (!this.fromCode) {
          this.fromCode = 'GBP';
        }
        if (!this.toCode) {
          this.toCode = 'EUR';
        }
        this.loadingCurrencies = false;
      },
      error: () => {
        this.error = 'Failed to load currencies.';
        this.loadingCurrencies = false;
      }
    });
  }

  // Calls service to convert currency on Convert button press
  convert(): void {
    this.converting = true;
    this.error = null;
    this.currencyService
      .convertCurrency(this.fromCode, this.toCode, this.amount)
      .subscribe({
        next: (value) => {
          this.result = value;
          this.converting = false;
        },
        error: () => {
          this.error = 'Conversion failed.';
          this.converting = false;
        }
      });
  }

  // Calls service to convert base conversion for 1 unit on page unit and currency changes
  convertBase(): void {
    this.error = null;
    this.currencyService
      .convertCurrency(this.fromCode, this.toCode, 1)
      .subscribe({
        next: (value) => {
          this.baseResult = value;
        },
        error: () => {
          this.baseError = 'Base Conversion failed.';
        }
      });
  }
}
