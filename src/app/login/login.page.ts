import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavController, AlertController,Platform} from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  datalogin: any;
  loginform: FormGroup;
  IsFound:any;
  Token:any;
  Username:any;
  constructor(
    private http: HttpClient, 
    public formBuilder: FormBuilder,
    private router: Router,
    public nav:NavController,
    private authService: AuthenticationService,
    private alertController:AlertController) {

    this.loginform = this.formBuilder.group({
      Username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      Password: new FormControl('', Validators.compose([
        Validators.required
      ])),

    })
  }

  async NoUserAlert() {
    const NoUserAlert = await this.alertController.create({
      header: "This username is doesn't exist",
      subHeader: " ",
      message: 'Please signup',
      buttons: ['OK']
    });

    await NoUserAlert.present();
   
  }

  async WrongPassAlert() {
    const WrongPassAlert = await this.alertController.create({
      header: 'Wrong password',
      subHeader: '',
      message: 'Please try again',
      buttons: ['OK']
    });

   


    await WrongPassAlert.present();
   
  }


  
  OnLogin() {
    
    this.CheckLogin((Isfound: string)=>{
      if(Isfound=="found"){
      
        this.router.navigate(['/main_tabs/tabs/home'],{ replaceUrl:true });

      }
      else if(Isfound =="Nouser"){
        this.NoUserAlert();
      
      }
      else{
        this.WrongPassAlert();
       
      }
  
    });
  

  }

  ngOnInit() {
  }
  
  public CheckLogin(callback: { (Isfound: string): void; (arg0: any): void; }){
    this.datalogin = {Username: this.loginform.value.Username,Password: this.loginform.value.Password}

   // alert(JSON.stringify(this.datalogin));
    this.http.post<any>("https://beltanimeapp.herokuapp.com/api/AnimeApp/login", this.datalogin).subscribe(result => {
      this.IsFound = result.Found;
      this.Token = result.Token;
      this.Username = result.Username;
     // console.log(this.Username);
     // console.log(this.Token);
      this.authService.login(this.Token,this.Username);
     // console.log(this.IsFound);
      callback(this.IsFound);
    });


  }

  
}
