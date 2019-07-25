import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { IonicRatingModule } from "ionic4-rating";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FavoritePage } from '../favorite/favorite.page';

const USERNAME_KEY = 'auth-Username';
//const TOKEN_KEY = 'auth-token';

@Component({
  providers: [FavoritePage],
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  AnimeObject: any;
  Description: string;
  Rating: number;
  user: any;
  Reviews: any;
  Favorites: any;

  GetReviews: any;
  ReverseReviews: any;
  AnimeFavorite: any;

  IsAdd: any;
  GetUser: any;
  GetFavoritedata: any;

  favorite: any;
  newdoc: any;
  constructor(
    private fav: FavoritePage,
    private storage: Storage,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public nav: NavController,
    public Raiting: IonicRatingModule,
    public alertController: AlertController) {

    //  console.log("halo constuctor")
  }

  GetUsername() {
    this.storage.get(USERNAME_KEY)
      .then(res => {
        if (res) {
          this.user = res;
      //    console.log("user form storage = " + this.user);
        }
      })
      .catch(error => {
        if (error) console.log(error);
      });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {

      this.AnimeObject = res;
     // console.log(this.AnimeObject);

      this.GetUsername();
    });


    this.http.get('https://arcane-springs-85188.herokuapp.com/api/AnimeApp/GetReviews').subscribe((reviews) => {

      this.GetReviews = reviews;
      // console.log(this.GetReviews);
      this.ReverseReviews = this.GetReviews.reverse();
      //   console.log(this.GetReviews);
    });


  }


  async CheckAdd() {
    const CheckAdd = await this.alertController.create({
      header: '',
      subHeader: 'You have already added this anime ',
      message: '',
      buttons: ['OK']
    });

    await CheckAdd.present();

  }

  async OnclickAddfavorite() {
    let Add = await this.AddFavorite();
    //  console.log(Add);
    if (Add === "Added") {
      this.CheckAdd();
    }
  }

  public AddFavorite() {

    return new Promise((resolve, reject) => {

      this.AnimeFavorite = {
        Username: this.user,
        anime_image_path: this.AnimeObject.anime_image_path,
        anime_media_type_string: this.AnimeObject.anime_media_type_string,
        anime_mpaa_rating_string: this.AnimeObject.anime_mpaa_rating_string,
        anime_title: this.AnimeObject.anime_title
      }
      this.http.post<any>("http://localhost:3000/api/AnimeApp/addFavorite", this.AnimeFavorite).subscribe(result => {
        this.IsAdd = result.Add;
        //   this.newdoc = result.doc;
        //  console.log(this.newdoc);
        // this.fav.AddNewFavoriteData();
        resolve(this.IsAdd);




      });

    });
  }

  deleteReviews(Description: any) {


    var deleteReviews = {
      Animetitle: this.AnimeObject.anime_title,
      Username: this.user,
      Description: Description
    }

    this.http.post<any>("http://localhost:3000/api/AnimeApp/deleteReviews", deleteReviews).subscribe(result => {


      this.http.get('http://localhost:3000/api/AnimeApp/GetReviews').subscribe((reviews) => {

        this.GetReviews = reviews;

        this.ReverseReviews = this.GetReviews.reverse();

      });



    });
  }


  SendReviews() {

    this.Reviews = {
      Username: this.user,
      Description: this.Description,
      Rating: this.Rating,
      Animetitle: this.AnimeObject.anime_title
    }
    // console.log(JSON.stringify(this.Reviews));

    if (this.Description) {
      this.http.post<any>("http://localhost:3000/api/AnimeApp/addReviews", this.Reviews).subscribe(result => {
        // alert(result);
        // console.log(result);
        this.Description = '';

        this.http.get('http://localhost:3000/api/AnimeApp/GetReviews').subscribe((reviews) => {

          this.GetReviews = reviews;
          //  console.log(this.GetReviews);
          this.ReverseReviews = this.GetReviews.reverse();
          //  console.log(this.GetReviews);
        });



      });
    }
  }

  onModelChange($event: any) {
    console.log("Rating = ", $event)
  }

}
