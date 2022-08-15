import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {

  imageBaseUrl = environment.images;
  movies$ = this.movieService.getTopRatedMovies();

  constructor(
    private movieService: MovieService,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {

    const loading = await this.loadingCtrl.create({
      message: 'loading ...',
      spinner: 'bubbles',
    });
    await loading.present();

    this.movieService.getNextTopRatedMovies();

    await loading.dismiss();
    event?.target.complete();
  }


}
