import { TestBed } from '@angular/core/testing';

import { TeleAtendimentoService } from './tele-atendimento.service';

describe('TeleAtendimentoService', () => {
  let service: TeleAtendimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeleAtendimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
