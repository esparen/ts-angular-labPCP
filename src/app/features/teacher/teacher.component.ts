import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViaCepService } from '../../core/services/viacep.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService, IDisciplines } from '../../core/services/enrollment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule
  ],
})
export class TeacherComponent implements OnInit {
  teacherForm!: FormGroup;
  genders = ['Masculino', 'Feminino', 'Outro'];
  maritalStatuses = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  subjects = [] as IDisciplines[];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.teacherForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      gender: ['', Validators.required],
      birthDate: ['', [Validators.required, this.dateValidator]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      maritalStatus: ['', Validators.required],
      phone: ['', [Validators.required, this.phoneValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      naturalness: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      cep: ['', [Validators.required, Validators.minLength(8)]],
      street: [{ value: '', disabled: true }],
      number: [{ value: '', disabled: false }],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      complement: [''],
      subjects: [[], Validators.required],
    });
    this.enrollmentService.getDisciplines().subscribe((disciplines) => {
      this.subjects = disciplines;
    });
  }

  cpfValidator(control: FormControl) {
    /* CPF validation logic */
  }
  dateValidator(control: FormControl) {
    /* Date validation logic */
  }
  phoneValidator(control: FormControl) {
    /* Phone validation logic */
  }

  onCepBlur() {
    const cep = this.teacherForm.get('cep')?.value;
    this.viaCepService.getAddressByCep(cep).subscribe((address) => {
      console.log('address', address);
      
      this.teacherForm.patchValue({
          city: address.localidade,
          state: address.uf,
          street: address.logradouro,
          neighborhood: address.bairro
      });
    });
  }

  onSave() {
    if (this.teacherForm.invalid) return;

    const teacherData = this.teacherForm.value;
    if (this.isEditMode) {
      this.userService.setUser(teacherData).subscribe(() => {
        this.snackBar.open('Docente atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
    } else {
      this.userService.addUser(teacherData).subscribe(() => {
        this.snackBar.open('Docente cadastrado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
    }
  }

  onEdit() {
    // Logic to switch to edit mode
  }

  onDelete() {
    // Logic to delete teacher
  }
}
