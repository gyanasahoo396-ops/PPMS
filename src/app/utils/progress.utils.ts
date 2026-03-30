export type StatusCategory = 'Delayed' | 'LowProgress' | 'OnTrack' | 'Completed';

/**
 * Compute how many percent of the project timeline has elapsed (0-100).
 * Returns 0 if today is before start, 100 if today is past end.
 */
export function calculateExpectedProgress(start: string, end: string): number {
    const startMs = new Date(start).getTime();
    const endMs   = new Date(end).getTime();
    const todayMs = Date.now();
    if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) return 0;
    if (todayMs <= startMs) return 0;
    if (todayMs >= endMs)   return 100;
    return Math.round(((todayMs - startMs) / (endMs - startMs)) * 100);
}

/**
 * Classify a project's health based on physical progress vs expected pace.
 *
 * Rules (in priority order):
 *  1. physical >= 100         → Completed
 *  2. today > endDate & < 100 → Delayed
 *  3. physical < expected     → Delayed
 *  4. physical < 50           → LowProgress
 *  5. otherwise               → OnTrack
 */
export function classifyProjectStatus(
    physical: number,
    expectedProgress: number,
    end: string
): StatusCategory {
    if (physical >= 100) return 'Completed';
    const today   = Date.now();
    const endDate = new Date(end).getTime();
    if (!isNaN(endDate) && today > endDate && physical < 100) return 'Delayed';
    if (physical < expectedProgress) return 'Delayed';
    if (physical < 50) return 'LowProgress';
    return 'OnTrack';
}

/**
 * Returns true if the project's target date has passed by more than `thresholdDays`.
 */
export function isOverdueByDays(end: string, status: string, thresholdDays: number): boolean {
    if (status === 'Completed') return false;
    const endMs = new Date(end).getTime();
    if (isNaN(endMs)) return false;
    return (Date.now() - endMs) / (1000 * 60 * 60 * 24) > thresholdDays;
}

/**
 * Tailwind-class color for a progress bar based on actual vs expected progress.
 */
export function getProgressBarClass(physical: number, expected: number): string {
    if (physical >= 100) return 'bg-emerald-500';
    if (physical < expected - 10) return 'bg-red-500';
    if (physical < 50) return 'bg-amber-500';
    return 'bg-blue-500';
}
