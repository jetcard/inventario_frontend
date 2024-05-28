import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: '[appCurrencyFormat]'
})
export class CurrencyFormatDirective {
  private el: HTMLInputElement;

  /*@Input() appCurrencyFormat: string = 'USD'; // Código de moneda por defecto

  constructor(private elementRef: ElementRef, private currencyPipe: CurrencyPipe) {
    this.el = this.elementRef.nativeElement;
  }*/


  constructor(private elementRef: ElementRef, private decimalPipe: DecimalPipe) {
    this.el = this.elementRef.nativeElement;
  }  

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.value;

    // Eliminar caracteres no numéricos excepto el punto decimal
    this.el.value = initialValue.replace(/[^0-9.]/g, '');
    this.el.value = this.formatDecimal(this.el.value);
    //this.el.value = this.formatCurrency(this.el.value);

    if (initialValue !== this.el.value) {
      event.stopPropagation();
    }
  }

  private formatDecimal(value: string): string {
    if (value) {
      const numericValue = parseFloat(value);
      //return this.decimalPipe.transform(numericValue, '1.2-2') || '';
      return this.decimalPipe.transform(numericValue, '1.2-2', 'en-US') || '';
    }
    return '';
  }

  /*private formatCurrency(value: string): string {
    if (value) {
      const numericValue = parseFloat(value);
      return this.currencyPipe.transform(numericValue, this.appCurrencyFormat, 'symbol', '1.2-2') || '';
    }
    return '';
  }*/
}
