import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import {Observable} from 'rxjs';

const USERNAME_KEY = 'auth-Username';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  Favoritedata: any;
  user: any;



  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router:Router,
    ) { }

    GotoDetails(item:any){
      //console.log(item);
      this.router.navigate(['/main_tabs/tabs/details'],{
        queryParams: item,
      });
      
  }

  GetUsername() {
    this.storage.get(USERNAME_KEY)
      .then(res => {
        if (res) {
          this.user = res;
          //  console.log("user form storage/favorite = " + this.user);
        }
      })
      .catch(error => {
        if (error) console.log(error);
      });
  }

  ngOnInit() {

    this.http.get('https://beltanimeapp.herokuapp.com/api/AnimeApp/GetFavorites').subscribe((favdata) => {

      this.Favoritedata = favdata;
    //  console.log(this.Favoritedata[0].anime_title);
      this.GetUsername();
   
     
 
    });


  }
  delete(anime_title:any) {
  //  console.log(anime_title);

    var deleteObject={
      anime_title : anime_title,
      Username : this.user
    }
    
    this.http.post<any>("https://beltanimeapp.herokuapp.com/api/AnimeApp/deleteFavorite",deleteObject).subscribe(result => {
      
      this.http.get('https://beltanimeapp.herokuapp.com/api/AnimeApp/GetFavorites').subscribe((favdata) => {

        this.Favoritedata = favdata;
      
  
  
      });



    });
  }
  ionViewDidEnter() {

    this.http.get('https://beltanimeapp.herokuapp.com/api/AnimeApp/GetFavorites').subscribe((favdata) => {

      this.Favoritedata = favdata;
    


    });




  }





}
