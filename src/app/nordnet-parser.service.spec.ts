import { TestBed, inject } from '@angular/core/testing';

import { NordnetParserService } from './nordnet-parser.service';

describe('NordnetParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NordnetParserService]
    });
  });

  it('should be created', inject([NordnetParserService], (service: NordnetParserService) => {
    expect(service).toBeTruthy();
  }));
});
