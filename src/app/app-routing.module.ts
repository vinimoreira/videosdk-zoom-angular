import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeleAtendimentoComponent } from './tele-atendimento/tele-atendimento.component';
import { SampleComponent } from './sample/sample.component';

const routes: Routes = [
  { path: 'tele-atendimento', component: TeleAtendimentoComponent },
  { path: 'sample', component: SampleComponent },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }