import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MovieDetails, MovieService } from '../../services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  imageBaseUrl = environment.images;
  movieDetails$: Observable<MovieDetails>;
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.movieDetails$ = this.movieService.getMovieDetails(id);
  }

  openHomePage(url: string) {
    window.open(url);
  }
}
