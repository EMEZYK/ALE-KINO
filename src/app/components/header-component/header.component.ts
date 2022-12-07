import { Component, OnInit } from '@angular/core';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { LoggedUserService } from 'src/app/services/logged-user.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cinemaName = 'Ale kino!';
  signedInUser:User;
  // shoppingBasket = faShoppingBasket;

  constructor(private loginService: LoggedUserService) {}

  ngOnInit(): void {}

  signInUser() {
    this.loginService.getUser(true).subscribe((result) => {
      this.signedInUser = result;
      console.log(this.signedInUser)
    });
  }

  signInAdmin() {
    this.loginService.getUser(false).subscribe((result) => {
      console.log(result)
    })
  }
}

// this.choosenMovieService
//       .getChoosenMovieShowing()
//       .subscribe((result: ChoosenMovieShowing) => {
//         console.log('wybrany seans o wybranej godz.', result);
//         this.chosenMovieShowing = result;
//       });
//     this.getAllTickets();
