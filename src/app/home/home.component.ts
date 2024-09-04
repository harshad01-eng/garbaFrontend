import { CommonModule,isPlatformBrowser   } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit,PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

declare var bootstrap :any
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {


  constructor(
    private router: Router,  @Inject(PLATFORM_ID) private platformId: Object
  ){}

ngOnInit(): void {

}

ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) {
  const carsaoulElement = document.getElementById('sponsorCarousel')

  new bootstrap.Carousel(carsaoulElement, {
    interval: 2000 // Adjust the interval as needed
  
  });
}
}

clickRegister() {
  this.router.navigate(['form'])
  }
  clickVerify() {
    this.router.navigate(['detail'])
  }

  clickDataGrid() {
    this.router.navigate(['admin'])
  }


}
