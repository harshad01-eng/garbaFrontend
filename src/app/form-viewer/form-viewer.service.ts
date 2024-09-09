import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegistDto } from "../app.form.model";
import { catchError, map, Observable, throwError } from "rxjs";



@Injectable({
    providedIn:'root'
})  

export class FormService {

    private apiUrl = 'http://localhost:8080/api';

    constructor(private http : HttpClient){}

    registerDetail(registDto: RegistDto): Observable<RegistDto> {
        const url = this.apiUrl + '/register'
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<RegistDto>(url, registDto, { headers }).pipe(catchError(this.handleError));
    }

    getDetailByMobileNo(mobileNo: String) : Observable<RegistDto[]> {
        return this.http.get<RegistDto[]>(`${this.apiUrl}/detail/${mobileNo}`).pipe(catchError(this.handleError));
    }

    getDetailById(id:number): Observable<RegistDto>{
        return this.http.get<RegistDto>(`${this.apiUrl}/edit/${id}`)
    }

   

    login(username:string, password:string){
        return this.http.post<any>(`${this.apiUrl}/login`,{username,password}).pipe(map((res : any)=> {
            return res
        }));
    }

    getAllData(): Observable<RegistDto[]> {
        return this.http.get<RegistDto[]>(`${this.apiUrl}/gridData`)
    }

    downloadPdfById(id: number) {
        return this.http.get<Blob>(`${this.apiUrl}/getPdf/${id}`, { responseType : 'blob' as 'json'});
    }

    private handleError(error: any) {
        return throwError(() => error);
    }
}