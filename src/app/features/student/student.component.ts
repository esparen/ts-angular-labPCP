import { Component } from '@angular/core';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  constructor(private studentService: StudentService) {}

}
