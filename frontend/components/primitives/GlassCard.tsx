import { styled } from 'tamagui';
import { BlurView } from 'expo-blur';

export const GlassCard = styled(BlurView, {
  tint: 'default',
  intensity: 50,
  borderRadius: '$4',
  padding: '$4',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  borderWidth: 1,
  overflow: 'hidden',
});
