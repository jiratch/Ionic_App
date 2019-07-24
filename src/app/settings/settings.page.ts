import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private authService: AuthenticationService,public router: Router) { }

  public logout(){
    this.authService.logout();
    this.router.navigate(['/login'],{replaceUrl:true});
  }
  
  ngOnInit() {
  }

}
