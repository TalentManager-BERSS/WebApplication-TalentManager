/**
 * Represents a course entity in the system
 */
export class Report {
  /** Unique identifier for the course */
  id: number;

  /** Title of the course */
  title: string;

  /** Detailed description of the course content */
  description: string;

  /**
   * Creates a new Course instance
   * @param report - The course initialization object
   * @param report.id - The course ID (defaults to 0 if not provided)
   * @param report.title - The course title (defaults to empty string if not provided)
   * @param report.description - The course description (defaults to empty string if not provided)
   */
  constructor(report: {id?: number, title?: string, description?: string}) {
    this.id = report.id || 0;
    this.title = report.title || '';
    this.description = report.description || '';
  }
}
