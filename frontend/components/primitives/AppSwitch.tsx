import { Switch, SwitchProps, styled } from "tamagui";

interface AppSwitchProps extends SwitchProps {
  checked: boolean;
}

export const AppSwitch: React.FC<AppSwitchProps> = ({ checked, ...props }) => {
  return (
    <Switch
      transition="300ms"
      backgroundColor={checked ? "$primary" : "$surfaceTintBlue"}
      size="$7"
      borderWidth="$0"
      paddingBlock="$1"
      paddingInline="$1"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Switch.Thumb height={17} width={17} />
    </Switch>
  );
};
