import { Component, OnInit, inject } from '@angular/core';
import { ExampleFacade } from '../../facades/example.facade';
import { CommonModule } from '@angular/common';
import { Button } from '@shared/components/atoms/button/button';


@Component({
  selector: 'app-example-page',
  imports: [CommonModule, Button],
  providers: [ExampleFacade],
  templateUrl: './example-page.html',
  styleUrl: './example-page.scss',
})
export class ExamplePage implements OnInit {
  readonly facade = inject(ExampleFacade);

  ngOnInit(): void {
    this.facade.loadItems();
  }

  handleItemClick(item: any): void {
    this.facade.selectItem(item);
  }

  handleRefresh(): void {
    this.facade.loadItems();
  }
}
