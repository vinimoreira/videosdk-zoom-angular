import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleAtendimentoComponent } from './tele-atendimento.component';

describe('TeleAtendimentoComponent', () => {
  let component: TeleAtendimentoComponent;
  let fixture: ComponentFixture<TeleAtendimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeleAtendimentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeleAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
