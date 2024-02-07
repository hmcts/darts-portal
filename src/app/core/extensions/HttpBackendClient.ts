import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
/*
    Use HttpBackendClient instead of HttpClient for calls to bypass HTTP_INTERCEPTOR
    https://github.com/angular/angular/issues/20203
*/
export class HttpBackendClient extends HttpClient {}
