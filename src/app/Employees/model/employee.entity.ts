/**
 * Represents a employee entity in the system
 */
export class Employee {
  /** Unique identifier for the employee */
  id: number;

  /** Title of the employee */
  name: string;

  /** Detailed description of the employee content */
  adress: string;

  ocupation: string;

  entrydate: string;

  team: string;




  /**
   * Creates a new employee instance
   * @param employee - The employee initialization object
   * @param employee.id - The employee ID (defaults to 0 if not provided)
   * @param employee.title - The employee title (defaults to empty string if not provided)
   * @param employee.description - The employee description (defaults to empty string if not provided)
   */
  constructor(employee: {id?: number, name?: string, adress?: string, ocupation?: string, entrydate?: string, team?: string}) {
    this.id = employee.id || 0;
    this.name = employee.name || '';
    this.adress = employee.adress || '';
    this.ocupation = employee.ocupation || '';
    this.entrydate = employee.entrydate || '';
    this.team = employee.team || '';

  }
}
