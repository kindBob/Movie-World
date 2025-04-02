import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OMDBMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

@Injectable({
  providedIn: 'root',
})
export class OMDBService {
  private http = inject(HttpClient);
  private apiKey = '3a3cdf11';
  private baseUrl = 'https://www.omdbapi.com/';

  getMovieByImdbId(imdbId: string): Observable<OMDBMovie> {
    return this.http.get<OMDBMovie>(
      `${this.baseUrl}?i=${imdbId}&apikey=${this.apiKey}`
    );
  }
}
