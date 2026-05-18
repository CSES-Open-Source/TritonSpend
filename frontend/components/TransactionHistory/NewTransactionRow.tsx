import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { XStack, YStack } from "tamagui";
import { AppText } from "../primitives/AppText";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  name: string;
  category: string;
  date: string;
  amount: string;
  deleteCallback: () => void;
}

/*
  this is the container for every row in the transaction history, which includes the icon for the transaction,
  name of transaction, date of transaction, and the amount.

  props - this component takes props for the name, date, amount of the transactions
 */
export default function NewTransactionRow(props: Props) {
  const [icon, setIcon] = useState<any>("");
  const categoryIconMapping: { [key: string]: string } = {
    Food: "fast-food-outline",
    Shopping: "pricetag-outline",
    Transportation: "bus-outline",
    Subscriptions: "calendar-outline",
    Other: "planet-outline",
  };

  useEffect(() => {
    const iconName: string =
      categoryIconMapping[props.category] || "card-outline";
    setIcon(iconName);
  }, []);

  const year = parseInt(props.date.substring(0, 4));
  const month = parseInt(props.date.substring(5, 7));
  const day = parseInt(props.date.substring(8, 10));
  const transactionDate = Date.UTC(year, month - 1, day);
  const todayDate = Date.now();
  const deltaDay = Math.floor(
    (todayDate - transactionDate) / (24 * 60 * 60 * 1000),
  );

  let relativeDate = "";
  if (deltaDay == 0) {
    relativeDate = "Today";
  } else if (deltaDay == 1) {
    relativeDate = "Yesterday";
  } else if (deltaDay < 7) {
    relativeDate = `${deltaDay} day${deltaDay == 1 ? "" : "s"} ago`;
  } else if (deltaDay < 28) {
    const deltaWeek = Math.round(deltaDay / 7);
    relativeDate = `${deltaWeek} week${deltaWeek == 1 ? "" : "s"} ago`;
  } else if (deltaDay < 365) {
    const deltaMonth = Math.round(deltaDay / 30);
    relativeDate = `${deltaMonth} month${deltaMonth == 1 ? "" : "s"} ago`;
  } else {
    const deltaYear = Math.round(deltaDay / 365);
    relativeDate = `${deltaYear} year${deltaYear == 1 ? "" : "s"} ago`;
  }

  return (
    <XStack
      padding="$4"
      borderRadius="$5"
      gap="$4"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="$surfaceTintBlue"
    >
      <XStack gap="$3" flex={1}>
        <YStack
          marginVertical="auto"
          width="$9"
          height="$9"
          borderRadius="$7"
          backgroundColor="$border"
          justifyContent="center"
          alignItems="center"
        >
          <Ionicons name={icon} size={25} color="#395773" />
        </YStack>
        <YStack gap="$1" flex={1}>
          <AppText
            variant="title"
            fontSize="$4"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {props.name}
          </AppText>
          <AppText
            variant="caption"
            fontSize="$4"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >{`${props.category} • ${relativeDate}`}</AppText>
        </YStack>
      </XStack>
      <XStack gap="$3">
        <AppText
          variant="title"
          fontSize="$4"
          marginVertical="auto"
        >{`-$${props.amount}`}</AppText>
        <TouchableOpacity onPress={props.deleteCallback}>
          <AppText color="$danger">✕</AppText>
        </TouchableOpacity>
      </XStack>
    </XStack>
  );
}
