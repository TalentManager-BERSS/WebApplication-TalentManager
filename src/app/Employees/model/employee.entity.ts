/**
 * Represents a employee entity in the system
 */
export class Employee {
  /** Unique identifier for the employee */
  id: number;

  /** Title of the employee */
  title: string;

  /** Detailed description of the employee content */
  description: string;

  /**
   * Creates a new employee instance
   * @param employee - The employee initialization object
   * @param employee.id - The employee ID (defaults to 0 if not provided)
   * @param employee.title - The employee title (defaults to empty string if not provided)
   * @param employee.description - The employee description (defaults to empty string if not provided)
   */
  constructor(employee: {id?: number, title?: string, description?: string}) {
    this.id = employee.id || 0;
    this.title = employee.title || '';
    this.description = employee.description || '';
  }
}
