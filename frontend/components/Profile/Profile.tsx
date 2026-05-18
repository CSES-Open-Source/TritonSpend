import { Image } from "react-native";
import { XStack, YStack } from "tamagui";
import { AppText } from "@/components/primitives/AppText";
import { Card } from "@/components/primitives/Card";

interface ProfileProps {
  userName: string;
  profilePic: string;
  Email: string;
}

export default function Profile({ userName, profilePic, Email }: ProfileProps) {
  return (
    <Card>
      <XStack justifyContent="space-between" alignItems="center" width="100%">
        <YStack gap="$2" flex={1}>
          <AppText variant="title" fontSize="$5">
            {userName}
          </AppText>
          <AppText variant="caption">@{Email}</AppText>
        </YStack>
        <Image
          source={profilePic ? { uri: profilePic } : {}}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "#DBD7D7",
          }}
        />
      </XStack>
    </Card>
  );
}
