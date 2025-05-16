import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../shared/services/reportsbase.service';
import {Report} from "../../../model/reporte.entity"
import {environment} from '../../../../../environments/environment';

/**
 * API endpoint path for courses obtained from environment configuration.
 */
const coursesResourceEndpointPath = environment.reportsEndpointPath;

/**
 * Service responsible for managing course-related HTTP operations.
 * Extends BaseService to provide CRUD operations for Course entities.
 *
 * Available operations inherited from BaseService:
 * - GET    /api/courses     - Retrieve all courses
 * - GET    /api/courses/:id - Retrieve a specific course
 * - POST   /api/courses     - Create a new course
 * - PUT    /api/courses/:id - Update an existing course
 * - DELETE /api/courses/:id - Delete a course
 *
 * @example
 * ```typescript
 * constructor(private courseService: CourseService) {}
 *
 * // Get all courses
 * courseService.getAll().subscribe(courses => {...});
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<Report> {

  /**
   * Initializes the CourseService.
   * Sets up the base URL endpoint for all course-related HTTP requests.
   */
  constructor() {
    super();
    this.resourceEndpoint = coursesResourceEndpointPath;
  }
}
