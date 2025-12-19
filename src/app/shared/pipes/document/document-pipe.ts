import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'document',
  standalone: true
})
export class DocumentPipe implements PipeTransform {
  transform(value: string, type: 'cpf' | 'cnpj' = 'cpf'): string {
    if (!value) return '';
    
    const cleaned = value.replace(/\D/g, '');
    
    if (type === 'cpf' && cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    if (type === 'cnpj' && cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return value;
  }
}
