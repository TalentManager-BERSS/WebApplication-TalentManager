import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';

import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";

import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {Employee} from '../../model/employee.entity';
import {EmployeeService} from '../../pages/Home/services/employee.service';
import {HomeComponent} from '../../pages/Home/components/home.component';
import {TranslatePipe} from '@ngx-translate/core';



/**
 * Component responsible for managing courses through a table interface.
 * Provides functionality for viewing, creating, updating, and deleting courses.
 * Features include pagination, sorting, and integrated CRUD operations.
 */
@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatIcon,
    MatHeaderRowDef,
    MatRowDef,
    NgClass,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatSortHeader,
    TranslatePipe
  ],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.css'
})
export class ListEmployeeComponent implements OnInit, AfterViewInit {


  protected courseData!: Employee;

  protected columnsToDisplay: string[] = ['id', 'name', 'lastname', 'ocupation', 'entrydate', 'team', 'actions'];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected dataSource!: MatTableDataSource<any>;

  private courseService: EmployeeService = inject(EmployeeService);

  constructor(private home: HomeComponent) {

    this.home.realeEditMode = false;
    this.courseData = new Employee({});
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

  protected onEditItem(item: Employee) {
    this.home.realeEditMode = true;
    this.home.selectedEmployee = item;
    this.home.vista = 0;
  }

  protected onDeleteItem(item: Employee) {
    this.deleteCourse(item.id);
  }

  /**
   * Retrieves all courses from the service and updates the table's data source.
   * Uses CourseService to fetch the data via HTTP.
   */
  private getAllCourses() {
    this.courseService.getAll().subscribe((response: Array<Employee>) => {
      this.dataSource.data = response;
    });
  }


  private deleteCourse(id: number) {
    this.courseService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((course: Employee) => course.id !== id);
    });
  }

}
