import {Component} from '@angular/core';
import {ListEmployeeComponent} from '../../../components/List-employee/list-employee.component';
import {EmployeeAddComponent} from '../../../components/Add-Employee/add-employee.component';
import {NgIf} from '@angular/common';
import {Employee} from '../../../model/employee.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [
    ListEmployeeComponent,
    EmployeeAddComponent,
    NgIf,
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  public selectedEmployee: Employee = new Employee({});
  public vista = 2;
  public realeEditMode = false;

  goToAddEmployees() {
    this.vista = 0;

  }
  goToManageEmployees() {
    this.vista = 1;
  }
}
