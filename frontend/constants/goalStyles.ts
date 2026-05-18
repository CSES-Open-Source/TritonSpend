/** Shared goal card appearance — light blue surface, dark text */
export const GOAL_CARD_BACKGROUND = "#E6F1F4";
export const GOAL_CARD_TEXT = "#1C252E";

export function sortGoalsByTargetDate<T extends { target_date: string }>(
  goals: T[],
): T[] {
  return [...goals].sort(
    (a, b) =>
      new Date(a.target_date).getTime() - new Date(b.target_date).getTime(),
  );
}
