import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseUrls } from '../base-urls';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private router: Router
  ) { }

  loginUser(value: {email: string; password: string}) {
    const formData = new FormData();
    formData.append("email", value.email.trim() || "");
    formData.append("password", value.password.trim() || "");

    this.http.post(BaseUrls.getLoginUrl(BaseUrls.ADMIN_GROUPURL), formData)
    .subscribe({
      next: (value: any) => {
        localStorage.setItem("user", JSON.stringify(value?.user ?? {}));
        this.router.navigate(['/'], { replaceUrl: true })
        this.toast.success(value.message, "Login Successfull");
      },
      error: (error) => {  
        console.log(error);
        localStorage.setItem("user", JSON.stringify('{}'));
        this.toast.warning("Please Check Your Credentials", "");
      }
    })
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login'], { replaceUrl: true });
  }

}
