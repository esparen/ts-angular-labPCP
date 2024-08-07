import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  DialogComponent,
  IDialogData,
} from '../../core/components/dialog/dialog.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { LoginService } from '../../core/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  username: string = '';
  password: string = '';

  constructor(
    private fb: FormBuilder,
    private dialog: Dialog,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

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

  signIn() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.signIn(username, password).subscribe(user => {
        if (user) 
          this.snackBar.open(`Bem vindo, ${user.name}!`, 'Close', { duration: 5000 });
        else
          this.snackBar.open('Usuário não encontrado ou senha inválida', 'Close', { duration: 5000 });
      });
    } else {
      this.snackBar.open('Dados incorretos, revise as mensagens de erro nos campos usuário e senha', 'Close', { duration: 5000 });
    }
  }
}
