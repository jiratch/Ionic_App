import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { NavController, AlertController,Platform} from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  datasignup:any;
  signupform:FormGroup;
  IsUsed:any;

  error_message={
    'email':[
      { type:'required',message:'Email is required'},
      { type:'pattern',message:'Please enter a valid email'}
    ]

  }

  constructor(private http: HttpClient,public formBuilder: FormBuilder,public nav:NavController,private alertController:AlertController) { 

    this.signupform = this.formBuilder.group({
        Username:new FormControl('',Validators.compose([
        Validators.required
      ])),
        Password:new FormControl('',Validators.compose([
        Validators.required
      ])),
        Email:new FormControl('',Validators.compose([
        Validators.required,
      //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    })
  
}

async RepeatedUserAlert() {
  const RepeatedUserAlert = await this.alertController.create({
    header: 'The username is already exist',
    subHeader: '',
    message: 'Please try again',
    buttons: ['OK']
  });

  await RepeatedUserAlert.present();
 
}

async SuccessAlert() {
  const SuccessAlert = await this.alertController.create({
    header: 'Signing up Successfully',
    subHeader: '',
    message: 'Welcome',
    buttons: ['OK']
  });

  await SuccessAlert.present();
 
}

OnConfirm(){

  this.CheckSignup((IsUsed)=>{
    if(IsUsed=="Notyet"){
      this.SuccessAlert();
    this.nav.navigateForward('/login');
    }
    else if(IsUsed=="Used"){
      this.RepeatedUserAlert();
    }
    

  });


  }

  public CheckSignup(callback: { (IsUsed: any): void; (arg0: any): void; }){

    this.datasignup ={ 
      Username: this.signupform.value.Username,
      Password: this.signupform.value.Password ,
      Email:    this.signupform.value.Email
    }
   // alert(JSON.stringify(this.data));
   
      this.http.post<any>("http://localhost:3000/api/AnimeApp/signup",this.datasignup).subscribe(result=>{
      // alert(result);
       this.IsUsed = result.Use;
       callback(this.IsUsed);  
      });
  }
 
  

 ngOnInit():void { 
  
 }
}

