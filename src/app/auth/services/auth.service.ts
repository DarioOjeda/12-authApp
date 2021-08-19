import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
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

  registro( nombre: string, password: string, email: string) {
    const url = `${this.baseUrl}/auth/new`;
    const body = {
      nombre,
      email,
      password
    }

    return this.http.post<AuthResponse>(url, body)
                      .pipe(
                        tap( resp => {
                          if (resp.ok) {
                            localStorage.setItem('token', resp.token!);

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
                    localStorage.setItem('token', resp.token!);

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


  validarToken(): Observable<boolean> {

    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
            .set('x-token', localStorage.getItem('token') || '');


    return this.http.get<AuthResponse>( url, { headers } )
          .pipe(
            map( resp => {

              localStorage.setItem('token', resp.token!);
              this._usuario = {
                nombre: resp.nombre!,
                uid: resp.uid!
              }

              console.log(resp.token);

              return resp.ok
            }),
            catchError( err => of(false) )
          );
  }

  logout() {
    // localStorage.removeItem('token');
    localStorage.clear();
  }
}
