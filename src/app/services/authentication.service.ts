import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
const TOKEN_KEY = 'auth-token';
const USERNAME_KEY = 'auth-Username';
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  constructor(
    private storage: Storage, private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }
  //PROMISE CHECK TOKEN
  checkToken() {
    return new Promise( (resolve, reject) => {
      this.storage.get(TOKEN_KEY)
      .then(res => {
        if (res) {
          this.authenticationState.next(true);
         // console.log(res);
        }
        resolve();
       
      })
      .catch( error => {
        reject(error);
      });
    });
  }
//LOGIN
  async login(token: any,Username:any) {
   
    await this.storage.set(TOKEN_KEY,token);
    await this.storage.set(USERNAME_KEY,Username);
   // console.log("auth login "+Username);
    
   // this.authenticationState.next(true);
  }
//LOGOUT
  async logout() {
    await this.storage.remove(TOKEN_KEY);
    await this.storage.remove(USERNAME_KEY);
  //  console.log("logout")
    this.authenticationState.next(false);
  }
//PROMISE CHECK ISAUTHEN 
  isAuthenticated() {
    return new Promise( (resolve, reject) => {
      this.checkToken()
      .then( () => {
        resolve(this.authenticationState.value);
       // console.log(`check token and then ${this.authenticationState.value}`);
      })
      .catch( error => {
        reject(error);
      });
    });
  }
}