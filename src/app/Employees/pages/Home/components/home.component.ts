import {Component} from '@angular/core';
import {CourseManagementComponent} from '../../../components/Add-Employee/add-employee.component';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [
    CourseManagementComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

}
