import { YStack } from "tamagui";
import GoalsRow from "./GoalsRow";

interface Goal {
  id: number;
  title: string;
  details: string;
  target_date: string;
}

interface GoalsListProps {
  Goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  editGoal: (
    id: number,
    title: string,
    details: string,
    target_date: string,
  ) => void;
  deleteGoal: (id: number) => void;
}

export default function GoalsList({
  Goals,
  editGoal,
  deleteGoal,
}: GoalsListProps) {
  function formatDate(date: string) {
    const parsedDate = new Date(date);
    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <YStack gap="$3" width="100%">
      {Goals.map((goal) => (
        <GoalsRow
          key={goal.id}
          title={goal.title}
          date={formatDate(goal.target_date)}
          content={goal.details}
          deleteGoal={deleteGoal}
          editGoal={editGoal}
          id={goal.id}
        />
      ))}
    </YStack>
  );
}
