import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [],
  templateUrl: 'landing-page.html',
  styleUrl: 'landing-page.css',
})

export class LandingPageComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    new Swiper('.swiper', {
      direction: 'horizontal',
      loop: true,
      autoplay: {
        delay: 10000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoHeight: true,
    });
  }
}
