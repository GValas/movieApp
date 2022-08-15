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
}

export interface ApiResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private page$ = new BehaviorSubject(1);
  private movies$: Observable<Movie[]>;

  constructor(private readonly http: HttpClient) {

    this.movies$ = this.page$.pipe(
      switchMap((page) => this.http.get<ApiResult>(
        `${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`
      ).pipe(map(res => res.results))),
      scan((movies, newMovies) => movies.concat(newMovies), []),
    );
  }

  getNextTopRatedMovies() {
    this.page$.next(this.page$.value + 1);
  }

  getTopRatedMovies() {
    return this.movies$;
  };

  getMovieDetails(id: string) {
    return this.http.get(
      `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`
    );
  }
}
