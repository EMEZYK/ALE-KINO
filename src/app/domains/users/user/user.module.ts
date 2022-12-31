import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USER_ROUTES } from './user.routes';
import { UserHomePageComponent } from './user-home-page.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [UserHomePageComponent],
  imports: [
    CommonModule, RouterModule.forChild(USER_ROUTES)
  ]
})
export class UserModule { }
