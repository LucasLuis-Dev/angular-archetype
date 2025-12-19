import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplePage } from './example-page';

describe('ExamplePage', () => {
  let component: ExamplePage;
  let fixture: ComponentFixture<ExamplePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamplePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamplePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
