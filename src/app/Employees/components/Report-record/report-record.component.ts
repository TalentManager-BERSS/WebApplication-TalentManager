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
import {ReportCreateAndEditComponent} from '../report-create-and-edit/report-create-and-edit.component';
import {Report} from '../../model/reporte.entity';
import {ReportService} from '../../pages/Reports/services/report.service';
import {TranslatePipe} from '@ngx-translate/core';



/**
 * Component responsible for managing courses through a table interface.
 * Provides functionality for viewing, creating, updating, and deleting courses.
 * Features include pagination, sorting, and integrated CRUD operations.
 */
@Component({
  selector: 'report-record-app',
  standalone: true,
  imports: [
    ReportCreateAndEditComponent,
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
  templateUrl: './report-record.component.html',
  styleUrl: './report-record.component.css'
})
export class Report3 implements OnInit, AfterViewInit {

  //#region Attributes

  /** Current course being created or edited */
  protected courseData!: Report;

  /** Defines which columns should be displayed in the table and their order */
    protected columnsToDisplay: string[] = ['id', 'title', 'description', 'actions'];

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
  private courseService: ReportService = inject(ReportService);

  //#endregion

  //#region Methods

  /**
   * Initializes the component with default values and creates a new data source
   */
  constructor() {
    this.editMode = false;
    this.courseData = new Report({});
    this.dataSource = new MatTableDataSource();
    console.log(this.courseData);
  }

  /**
   * Lifecycle hook that runs after view initialization.
   * Sets up the Material table's paginator and sort functionality.
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Lifecycle hook that runs on component initialization.
   * Loads the initial course data.
   */
  ngOnInit(): void {
    this.getAllCourses();
  }

  /**
   * Handles the edit action for a course
   * @param item - The course to be edited
   */
  protected onEditItem(item: Report) {
    this.editMode = true;
    this.courseData = item;
  }

  /**
   * Handles the delete action for a course
   * @param item - The course to be deleted
   */
  protected onDeleteItem(item: Report) {
    this.deleteCourse(item.id);
  }

  /**
   * Handles the cancellation of create/edit operations.
   * Resets the component state and refreshes the course list.
   */
  protected onCancelRequested() {
    this.resetEditState();
    this.getAllCourses();
  }

  /**
   * Handles the addition of a new course
   * @param item - The new course to be added
   */
  protected onCourseAddRequested(item: Report) {
    this.courseData = item;
    this.createCourse();
    this.resetEditState();
  }

  /**
   * Handles the update of an existing course
   * @param item - The course with updated information
   */
  protected onCourseUpdateRequested(item: Report) {
    this.courseData = item;
    this.updateCourse();
    this.resetEditState();
  }

  /**
   * Resets the component's edit state to its default values.
   * Clears the current course data and exits edit mode.
   */
  private resetEditState(): void {
    this.courseData = new Report({});
    this.editMode = false;
  }

  /**
   * Retrieves all courses from the service and updates the table's data source.
   * Uses CourseService to fetch the data via HTTP.
   */
  private getAllCourses() {
    this.courseService.getAll().subscribe((response: Array<Report>) => {
      this.dataSource.data = response;
    });
  }

  /**
   * Creates a new course using the CourseService.
   * Updates the table's data source with the newly created course.
   */
  private createCourse() {
    this.courseService.create(this.courseData).subscribe((response: Report) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    });
  }

  /**
   * Updates an existing course using the CourseService.
   * Updates the corresponding course in the table's data source.
   */
  private updateCourse() {
    let courseToUpdate = this.courseData;
    this.courseService.update(courseToUpdate.id, courseToUpdate).subscribe((response: Report) => {
      let index = this.dataSource.data.findIndex((course: Report) => course.id === response.id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    });
  }

  /**
   * Deletes a course using the CourseService.
   * Removes the course from the table's data source.
   * @param id - The ID of the course to delete
   */
  private deleteCourse(id: number) {
    this.courseService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((course: Report) => course.id !== id);
    });
  }

  //#endregion
}
