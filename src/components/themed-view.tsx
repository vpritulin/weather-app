import { View, type ViewProps } from 'react-native';

import { Colors, type ThemeColor } from '@/constants/theme';
import { useThemeName } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = 'background',
  ...otherProps
}: ThemedViewProps) {
  const themeName = useThemeName();
  const theme = Colors[themeName];
  const backgroundColor = themeName === 'dark' ? darkColor : lightColor;

  return <View style={[{ backgroundColor: backgroundColor ?? theme[type] }, style]} {...otherProps} />;
}
