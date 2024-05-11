import { TestBed } from '@angular/core/testing';

import { ScenarioSpaceService } from './scenario-space.service';

describe('ScenarioSpaceService', () => {
  let service: ScenarioSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScenarioSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
