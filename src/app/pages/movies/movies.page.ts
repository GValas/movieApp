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
  ) {}

  async ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {
    // display loading
    const loading = await this.loadingCtrl.create({
      message: 'loading ...',
      spinner: 'bubbles',
    });
    await loading.present();

    // get additional movies
    this.movieService.getNextTopRatedMovies();

    // hide loading
    await loading.dismiss();

    // inifine loop context
    if (event) {
      event.target.complete();
      event.target.disabled = !this.movieService.hasNewMovies;
    }
  }
}
