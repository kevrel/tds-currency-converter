import { DecimalPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-currency-input',
  standalone: true,
  imports: [],
  providers: [DecimalPipe],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss'
})
export class CurrencyInputComponent {
  @Input() label = '';
  @Input() type: 'number' | 'text' = 'text';
  @Input() value: string | number | null = null;
  @Input() readonly = false;
  @Input() placeholder = '';
  @Input() format?: string;
  @Input() ariaLabel = '';
  @Output() valueChange = new EventEmitter<number>();

  constructor(private decimalPipe: DecimalPipe) {}

  get formattedValue(): string | number | null {
    if (this.format && typeof this.value === 'number') {
      return this.decimalPipe.transform(this.value, this.format);
    }
    return this.value;
  }

  // Amount to convert is passed up for conversion functions
  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const val = parseFloat(raw);
    this.valueChange.emit(isNaN(val) ? 0 : val);
  }
}
