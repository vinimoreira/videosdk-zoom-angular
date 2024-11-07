import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import uitoolkit from "@zoom/videosdk-ui-toolkit";
import ZoomVideo from '@zoom/videosdk';
import { ToastrService } from 'ngx-toastr';
import { TeleAtendimentoService } from '../services/tele-atendimento.service';

const client = ZoomVideo.createClient();
client.init('en-US', 'CDN');
const cloudRecording = client.getRecordingClient();

@Component({
  selector: 'app-tele-atendimento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tele-atendimento.component.html',
  styleUrls: ['./tele-atendimento.component.css']
})
export class TeleAtendimentoComponent implements OnInit {

  sessionContainer: HTMLElement | null = null;
  baseUrl = 'http://localhost:4000';
  inSession = false;

  sessionId: string | null = null;
  name: string | null = null;
  password: string | null = null;
  role: number | null = null;
  config: any = {};

  constructor(
    public httpClient: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private teleAtendimentoService: TeleAtendimentoService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId');
    this.name = this.route.snapshot.paramMap.get('name');
    this.password = this.route.snapshot.paramMap.get('password');
    const roleParam = this.route.snapshot.paramMap.get('role');

    if (roleParam === '0' || roleParam === '1') {
      this.role = Number(roleParam);
    } else {
      this.toastr.error("Invalid role parameter.", "Tele Atendimento");
      return;
    }

    this.iniciarTeleAtendimento();
  }

  iniciarTeleAtendimento(): void {
    if (!this.sessionId || !this.name || !this.password || this.role === null || this.role < 0) {
      this.toastr.error("Verifique os parâmetros enviados.", "Tele Atendimento");
      return;
    }

    this.teleAtendimentoService.get(this.sessionId, this.password)
      .subscribe({
        next: data => this.validarDadosAtendimento(data),
        error: error => {
          this.toastr.error("Erro ao buscar dados do Tele Atendimento", "Tele Atendimento");
          console.error('Erro ao buscar dados do Tele Atendimento:', error);
        }
      });
  }

  validarDadosAtendimento(atendimento: any): void {
    // if (new Date(atendimento.dataFinal) >= new Date()) {
    //   this.toastr.error("Atendimento já finalizado.", "Tele Atendimento");
    //   return;
    // }
    this.getVideoSDKJWT();
  }

  getVideoSDKJWT(): void {
    this.sessionContainer = this.document.getElementById('sessionContainer');
    
    if (!this.sessionContainer) {
      this.toastr.error("Não foi possível encontrar o Elemento", "Tele Atendimento");
      return;
    }

    this.inSession = true;

    this.config = {
      videoSDKJWT: '',
      sessionName: this.sessionId,
      userName: this.name,
      sessionPasscode: this.password,
      cloud_recording_option: 1,
      features: ['preview', 'video', 'audio', 'settings', 'users', 'chat', 'share'],
      options: { init: {}, audio: {}, video: {}, share: {} },
      virtualBackground: {
        allowVirtualBackground: false,
        allowVirtualBackgroundUpload: false,
      },
      role: this.role
    };

    if (!this.sessionId || !this.role)
      return;

    this.teleAtendimentoService.generateJWT(this.sessionId, this.role)
      .subscribe({
        next: data => {
          if (data.signature) {
            this.config.videoSDKJWT = data.signature;
            this.joinSession();
          }
        },
        error: error => {
          this.toastr.error("Erro ao gerar dados do Tele Atendimento", "Tele Atendimento");
          console.error('Erro ao gerar dados do Tele Atendimento:', error);
        }
      });
  }

  joinSession(): void {
    uitoolkit.joinSession(this.sessionContainer, this.config);
    uitoolkit.onSessionJoined(() => {
      console.log(cloudRecording.getCloudRecordingStatus());
    });
    uitoolkit.onSessionClosed(this.sessionClosed);
  }

  sessionClosed = (): void => {
    console.log('Session closed');
    if (this.sessionContainer) {
      uitoolkit.closeSession(this.sessionContainer);
    }
    this.inSession = false;
  }
}
