import { Component, inject } from '@angular/core';
import { Auth } from '../../entities/auth';
import { UsersService } from '../../services/users.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usersService = inject(UsersService);
  router = inject(Router);
  auth = new Auth("Peter", "sovy");
  hide = true;

  login() {
    this.usersService.login(this.auth).subscribe( success => 
          this.router.navigateByUrl('/extended-users'));
  }
}
