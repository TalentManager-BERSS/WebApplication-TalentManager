import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

import {EmployeeCreateAndEditComponent} from '../employee-create-and-edit/employee-create-and-edit';
import {Employee} from '../../model/employee.entity';
import {EmployeeService} from '../../pages/Home/services/employee.service';
import {HomeComponent} from '../../pages/Home/components/home.component';



/**
 * Component responsible for managing courses through a table interface.
 * Provides functionality for viewing, creating, updating, and deleting courses.
 * Features include pagination, sorting, and integrated CRUD operations.
 */
@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    EmployeeCreateAndEditComponent,
    TranslatePipe
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class EmployeeAddComponent implements OnInit, AfterViewInit {

  //#region Attributes

  /** Current course being created or edited */
  protected courseData!: Employee;

  /** Reference to the Material paginator for handling page-based data display */
  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  /** Reference to the Material sort directive for handling column sorting */
  @ViewChild(MatSort)
  protected sort!: MatSort;

  /** Controls whether the component is in edit mode */
  protected editMode: boolean = false;

  /** Material table data source for managing and displaying course data */
  protected dataSource!: MatTableDataSource<any>;

  /** Service for handling course-related API operations */
  private courseService: EmployeeService = inject(EmployeeService);

  constructor(private home: HomeComponent) {
    this.editMode = this.home.realeEditMode;
    this.courseData = this.home.selectedEmployee;
    this.dataSource = new MatTableDataSource();
    console.log(this.courseData);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAllCourses();
  }

  protected onCancelRequested() {
    this.resetEditState();
    this.getAllCourses();
  }

  protected onCourseAddRequested(item: Employee) {
    this.courseData = item;
    this.createCourse();
    this.resetEditState();
  }

  protected onCourseUpdateRequested(item: Employee) {
    this.courseData = item;
    this.updateCourse();
    this.resetEditState();
  }

  private resetEditState(): void {
    this.courseData = new Employee({});
    this.editMode = false;
  }

  private getAllCourses() {
    this.courseService.getAll().subscribe((response: Array<Employee>) => {
      this.dataSource.data = response;
    });
  }

  private createCourse() {
    this.courseService.create(this.courseData).subscribe((response: Employee) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    });
  }

  private updateCourse() {
    let courseToUpdate = this.courseData;
    this.courseService.update(courseToUpdate.id, courseToUpdate).subscribe((response: Employee) => {
      let index = this.dataSource.data.findIndex((course: Employee) => course.id === response.id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    });
  }

}
