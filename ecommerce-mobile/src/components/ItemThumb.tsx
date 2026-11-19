import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export function ItemThumb({ uri, size = 72 }: { uri: string | null; size?: number }) {
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[styles.image, { width: size, height: size }]}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: "#F5F6F8", borderRadius: 6 },
});
