/**
 * Utility function to get CSS class for project status
 * @param status The project status string
 * @returns CSS class name for the status
 */
export function getStatusClass(status: string): string {
  switch (status) {
    case 'Completed':
      return 'status-completed';
    case 'Stuck':
      return 'status-stuck';
    case 'Planned':
      return 'status-planned';
    default:
      return 'status-inprogress';
  }
}
