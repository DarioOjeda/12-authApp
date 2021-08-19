import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  constructor(private http: HttpClient ) { }

  login ( email: string, password: string) {
    
    const url = `${this.baseUrl}/auth`;
    const body = {
      email,
      password
    }

    return this.http.post<AuthResponse>(url, body)
              .pipe(
                tap( resp => {
                  if (resp.ok) {
                    this._usuario = {
                      nombre: resp.nombre!,
                      uid: resp.uid!
                    }
                  }
                }),
                map( resp => resp.ok ),
                catchError( err => of(err.error.msg) )
              );
  }
}
