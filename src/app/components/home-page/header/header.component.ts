import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cinemaName = 'Ale kino!';
  shoppingBasket = faShoppingBasket;
  
  constructor() {}

  ngOnInit(): void {}
}
