import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '../../../core/services/http/http.service';
import { ExampleModel } from '../models/example.model';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private readonly httpService = inject(HttpService);
  private readonly endpoint = 'items'; // endpoint relativo à baseUrl

  /**
   * Busca todos os itens
   */
  getItems(): Observable<ExampleModel[]> {
    return this.httpService.get<ExampleModel[]>(this.endpoint).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca um item por ID
   */
  getItemById(id: string): Observable<ExampleModel> {
    return this.httpService.get<ExampleModel>(`${this.endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cria um novo item
   */
  createItem(item: Omit<ExampleModel, 'id'>): Observable<ExampleModel> {
    return this.httpService.post<ExampleModel>(this.endpoint, item).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza um item existente (parcial)
   */
  updateItem(id: string, updates: Partial<ExampleModel>): Observable<ExampleModel> {
    return this.httpService.patch<ExampleModel>(`${this.endpoint}/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Substitui completamente um item
   */
  replaceItem(id: string, item: ExampleModel): Observable<ExampleModel> {
    return this.httpService.put<ExampleModel>(`${this.endpoint}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove um item
   */
  deleteItem(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca itens com filtros/query params
   */
  getItemsWithFilters(filters: Record<string, any>): Observable<ExampleModel[]> {
    const params = new HttpParams({ fromObject: filters });
    return this.httpService.get<ExampleModel[]>(this.endpoint, params).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca itens paginados
   */
  getItemsPaginated(page: number, limit: number): Observable<ExampleModel[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.httpService.get<ExampleModel[]>(this.endpoint, params).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca itens com múltiplos filtros
   */
  searchItems(searchTerm: string, filters?: Record<string, any>): Observable<ExampleModel[]> {
    let params = new HttpParams().set('search', searchTerm);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    
    return this.httpService.get<ExampleModel[]>(this.endpoint, params).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Tratamento de erros centralizado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Requisição inválida';
          break;
        case 401:
          errorMessage = 'Não autorizado';
          break;
        case 403:
          errorMessage = 'Acesso negado';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('Erro no ExampleService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
