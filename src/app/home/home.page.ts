import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController,Platform} from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  public items:Array<any> = [];
  public tempItems:Array<any> = [];

  constructor(
   
    private http: HttpClient,
    public nav:NavController,
    public router : Router,
    private activatedRoute: ActivatedRoute) {

      this.http.get('http://localhost:3000/AnimeData').subscribe((response:Array<any>) => {
        if(response && response.length){
          this.items = response;
          this.tempItems = response;
        }
  
      });
    }
    
  ShowDetails(Anime:any){
      this.router.navigate(['/main_tabs/tabs/details'],{
        queryParams: Anime,
      });
      
  }
  ngOnInit() {
    

  }

  public Search(ev:any){
    let val = ev.target.value;
    if(val && val.trim() != ''){
      this.items = this.tempItems.filter(item=>String(item.anime_title).toLowerCase().indexOf(String(val).toLowerCase())>-1);

    }else{
      this.items = this.tempItems;
    
    }
  }



}


