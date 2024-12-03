import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeleAtendimentoService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  get(sessionId: string, password: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/tele-atendimento/' + sessionId + '/' + password);
  }

  generateJWT(sessionId: string, role: number): Observable<any> {
    return this.http.post(this.baseUrl + '/tele-atendimento/auth', {
      sessionName: sessionId,
      role: role,
      cloud_recording_option: 1
    })
  }

  // this.httpClient.get(this.baseUrl + '/tele-atendimento/' + this.sessionId + '/' + this.password)
  //   .subscribe((data: any) => {
  //     console.log(data)
  //   })
}
