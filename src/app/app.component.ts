import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { FormBuilder } from '@angular/forms';

import uitoolkit from "@zoom/videosdk-ui-toolkit";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document: any, private formBuilder: FormBuilder,) {

  }

  sessionContainer: any;
  authEndpoint = 'https://slick-donkeys-tap.loca.lt'
  inSession: boolean = false

  sessionName: string = '';
  userName: string = '';
  password: string = '';
  role: number = 0;
  config: any ;
  

  ngOnInit() {
    
  }

  getVideoSDKJWT() {
    this.sessionContainer = document.getElementById('sessionContainer')

    this.inSession = true
    
    this.config = {
      videoSDKJWT: '',
      sessionName: this.sessionName,
      userName: this.userName,
      sessionPasscode: this.password,
      features: ['preview', 'video', 'audio', 'settings', 'users', 'chat', 'share'],
      options: { init: {}, audio: {}, video: {}, share: {}},
      virtualBackground: {
         allowVirtualBackground: true,
         allowVirtualBackgroundUpload: true,
        // virtualBackgrounds: ['https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop']
      },
      role: this.role
    };
    
  
    this.httpClient.post(this.authEndpoint, {
	    sessionName:  this.config.sessionName,
      role: this.role,
      cloud_recording_option: 0
    }).subscribe((data: any) => {
      if(data.signature) {
        console.log(data.signature)
        this.config.videoSDKJWT = data.signature
        this.joinSession()
      } else {
        console.log(data)
      }
    })
  }

  joinSession() {
    uitoolkit.joinSession(this.sessionContainer, this.config)

    uitoolkit.onSessionClosed(this.sessionClosed)
  }

  sessionClosed = (() => {
    console.log('session closed')
    uitoolkit.closeSession(this.sessionContainer)
    this.inSession = false
  })
}