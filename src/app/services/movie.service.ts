/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, shareReplay, switchMap, tap, scan } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Movie {
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  id: string;
}

export interface ApiResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails {
  title: string;
  poster_path: string;
  tagline: string;
  genres: { name: string }[];
  overview: string;
  release_date: Date;
  budget: number;
  homepage: string;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  public hasNewMovies = true;
  private page$ = new BehaviorSubject(1);
  private movies$: Observable<Movie[]>;

  constructor(private readonly http: HttpClient) {
    this.movies$ = this.page$.pipe(
      switchMap((page) =>
        this.http
          .get<ApiResult>(
            `${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`
          )
          .pipe(
            tap((res) => (this.hasNewMovies = res.total_pages !== res.page)),
            map((res) => res.results)
          )
      ),
      scan((movies, newMovies) => movies.concat(newMovies), [])
    );
  }

  getNextTopRatedMovies() {
    this.page$.next(this.page$.value + 1);
  }

  getTopRatedMovies() {
    return this.movies$;
  }

  getMovieDetails(id: string) {
    return this.http.get<MovieDetails>(
      `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`
    );
  }
}
