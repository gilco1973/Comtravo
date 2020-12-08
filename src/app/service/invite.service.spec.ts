import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InviteService } from './invite.service';

describe('InviteService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: InviteService = TestBed.get(InviteService);
    expect(service).toBeTruthy();
  });
});
