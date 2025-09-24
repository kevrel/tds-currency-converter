import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyOption } from '../../services/currency.service';

@Component({
  selector: 'app-currency-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-select.component.html',
  styleUrl: './currency-select.component.scss'
})
export class CurrencySelectComponent {
  @Input() label = '';
  @Input() selectedCode = '';
  @Input() currencies: CurrencyOption[] = [];
  @Output() selectedCodeChange = new EventEmitter<string>();

  // onFromChange or onToChange is fired when the options selected change
  onChange(value: string): void {
    this.selectedCodeChange.emit(value);
  }
}