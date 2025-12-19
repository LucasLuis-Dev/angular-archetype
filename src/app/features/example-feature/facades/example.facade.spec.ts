import { TestBed } from '@angular/core/testing';

import { ExampleFacade } from './example.facade';

describe('ExampleFacade', () => {
  let service: ExampleFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExampleFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
