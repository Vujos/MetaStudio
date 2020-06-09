import { TestBed } from '@angular/core/testing';

import { SkillGeneralService } from './skill-general.service';

describe('SkillGeneralService', () => {
  let service: SkillGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
