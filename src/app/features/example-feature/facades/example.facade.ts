import { Injectable, signal, computed, inject } from '@angular/core';
import { ExampleService } from '../services/example.service';
import { ExampleModel } from '../models/example.model';

@Injectable()
export class ExampleFacade {
  private readonly exampleService = inject(ExampleService);

  // State signals
  private readonly itemsState = signal<ExampleModel[]>([]);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);
  private readonly selectedItemState = signal<ExampleModel | null>(null);

  // Public readonly signals
  readonly items = this.itemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();

  // Computed signals
  readonly itemsCount = computed(() => this.itemsState().length);
  readonly hasItems = computed(() => this.itemsState().length > 0);
  readonly filteredItems = computed(() => {
    const items = this.itemsState();
    return items;
  });

  // Actions
  loadItems(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.exampleService.getItems().subscribe({
      next: (items) => {
        this.itemsState.set(items);
        this.loadingState.set(false);
      },
      error: (error) => {
        this.errorState.set(error.message);
        this.loadingState.set(false);
      },
    });
  }

  loadItemById(id: string): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.exampleService.getItemById(id).subscribe({
      next: (item) => {
        this.selectedItemState.set(item);
        this.loadingState.set(false);
      },
      error: (error) => {
        this.errorState.set(error.message);
        this.loadingState.set(false);
      },
    });
  }

  createItem(item: Omit<ExampleModel, 'id'>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.exampleService.createItem(item).subscribe({
      next: (newItem) => {
        this.itemsState.update((items) => [...items, newItem]);
        this.loadingState.set(false);
      },
      error: (error) => {
        this.errorState.set(error.message);
        this.loadingState.set(false);
      },
    });
  }

  selectItem(item: ExampleModel): void {
    this.selectedItemState.set(item);
  }

  addItem(item: ExampleModel): void {
    this.itemsState.update((items) => [...items, item]);
  }

  updateItem(id: string, updates: Partial<ExampleModel>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.exampleService.updateItem(id, updates).subscribe({
      next: (updatedItem) => {
        this.itemsState.update((items) =>
          items.map((item) => (item.id === id ? updatedItem : item))
        );
        this.loadingState.set(false);
      },
      error: (error) => {
        this.errorState.set(error.message);
        this.loadingState.set(false);
      },
    });
  }

  removeItem(id: string): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.exampleService.deleteItem(id).subscribe({
      next: () => {
        this.itemsState.update((items) => items.filter((item) => item.id !== id));
        this.loadingState.set(false);
      },
      error: (error) => {
        this.errorState.set(error.message);
        this.loadingState.set(false);
      },
    });
  }

  searchItems(searchTerm: string, filters?: Record<string, any>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.exampleService.searchItems(searchTerm, filters).subscribe({
      next: (items) => {
        this.itemsState.set(items);
        this.loadingState.set(false);
      },
      error: (error) => {
        this.errorState.set(error.message);
        this.loadingState.set(false);
      },
    });
  }

  clearSelection(): void {
    this.selectedItemState.set(null);
  }

  reset(): void {
    this.itemsState.set([]);
    this.loadingState.set(false);
    this.errorState.set(null);
    this.selectedItemState.set(null);
  }
}
