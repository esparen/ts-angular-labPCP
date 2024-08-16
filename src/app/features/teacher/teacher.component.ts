import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViaCepService } from '../../core/services/viacep.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService, IDisciplines } from '../../core/services/enrollment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';

type typeViewMode = 'read' | 'insert' | 'edit';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule
  ],
})
export class TeacherComponent implements OnInit {
  teacherForm!: FormGroup;
  genders = ['Masculino', 'Feminino', 'Outro'];
  maritalStatuses = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  subjects = [] as IDisciplines[];
  viewMode: typeViewMode = 'read';
  teacherId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const paramTeacherId = this.route.snapshot.queryParamMap.get('id');
    this.initializeForm();
    if (!paramTeacherId) {
      this.viewMode = 'insert';
      this.teacherForm.enable();
    } else {
      this.teacherId = paramTeacherId;
      this.loadTeacherData(this.teacherId);
      const viewModeParam =
        this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.teacherForm.disable();
      else this.teacherForm.enable();
    }
  }

  initializeForm() {
    this.teacherForm = this.fb.group({
      name: [
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
      number: [''],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      complement: [''],
      subjects: [[], [Validators.required]],
    });
    this.enrollmentService.getDisciplines().subscribe((disciplines) => {
      this.subjects = disciplines;
    });
  }

  loadTeacherData(teacherId: string) {
    this.userService.getUserById(teacherId).subscribe((teacher) => {
      this.teacherForm.patchValue(teacher);
    });
  }

  cpfValidator(control: FormControl) {
 /*    const cpf = control.value;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return { invalidCpf: true };
    }
    return null; */
  }
  dateValidator(control: FormControl) {
  /*   const date = control.value;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return { invalidDate: true };
    }
    return null; */
  }
  phoneValidator(control: FormControl) {}

  onCepBlur() {
    const cep = this.teacherForm.get('cep')?.value;
    this.viaCepService.getAddressByCep(cep).subscribe((address) => {
      console.log('address', address);

      this.teacherForm.patchValue({
        city: address.localidade,
        state: address.uf,
        street: address.logradouro,
        neighborhood: address.bairro,
      });
    });
  }

  onSave() {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched(this.teacherForm.controls);
      alert('Existem campos inválidos, revise e tente novamente');
      return;
    }

    const teacherData = this.teacherForm.value;
    teacherData.papelId = 2; // Docente
    if (this.viewMode === 'edit') {
      teacherData.id = this.teacherId;
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
     this.cancelEdit();
  }

  enableEdit() {
    // Logic to switch to edit mode
    this.viewMode = 'edit';
    this.teacherForm.enable();
  }

  cancelEdit() {
    if (this.teacherId) {
      this.loadTeacherData(this.teacherId);
    } else {
      this.teacherForm.reset();
    }
    this.viewMode = 'read';
    this.teacherForm.disable();
  }

  onDelete() {
    if (!this.teacherId) return;
    this.userService.deleteUser(this.teacherId).subscribe(() => {
      this.snackBar.open('Docente excluído com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.teacherForm.reset();
    });
  }
}
