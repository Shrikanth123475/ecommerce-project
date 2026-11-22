import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Shows the product image, or a neutral placeholder when there is no URL or the image fails to load
// (broken/expired links must never leave an empty gap in the cart or order screens).
export function ItemThumb({ uri, size = 72 }: { uri: string | null; size?: number }) {
  // Remember which URL failed, so a new URL (e.g. a recycled list row) gets a fresh attempt.
  const [failedUri, setFailedUri] = useState<string | null>(null);

  if (!uri || failedUri === uri) {
    return (
      <View style={[styles.placeholder, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.4 }}>🛍️</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size }]}
      contentFit="contain"
      cachePolicy="memory-disk"
      recyclingKey={uri}
      onError={() => setFailedUri(uri)}
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: "#F5F6F8", borderRadius: 6 },
  placeholder: { backgroundColor: "#F5F6F8", borderRadius: 6, alignItems: "center", justifyContent: "center" },
});
