import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DialogComponent,
  IDialogData,
} from '../../core/components/dialog/dialog.component';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';

export interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private dialog: Dialog) {}

  login() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }

  forgotPassword() {
    const dialogRef = this.dialog.open<IDialogData>(DialogComponent, {
      minWidth: '300px',
      data: {
        message: 'Funcionalidade não implementada',
        actions: [{ label: 'OK', action: 'close', visible: true }],
      },
    });
    dialogRef.closed.subscribe((result) => {
      console.log('Forgot password dialog was closed');
    });
  }

  signUp() {  
    const dialogRef = this.dialog.open<IDialogData>(DialogComponent, {
      minWidth: '300px',
      data: {
        message: 'Funcionalidade não implementada',
        actions: [{ label: 'OK', action: 'close', visible: true }],
      },
    });
    dialogRef.closed.subscribe((result) => {
      console.log('Sign up dialog was closed');
    });
  }
}
