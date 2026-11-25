import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent, type ScrollViewInstance } from "react-native";

import { ImageZoomModal } from "@/components/ImageZoomModal";
import { Brand } from "@/constants/theme";

// Flipkart/Amazon style gallery: swipe (or use the arrows) between photos, thumbnails underneath, tap to zoom.
export function ProductGallery({ images, badge }: { images: string[]; badge?: string | null }) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const pager = useRef<ScrollViewInstance>(null);

  const height = Math.min(Math.round(width * 0.95), 460);
  const showArrows = images.length > 1 && (Platform.OS === "web" || width > 700);

  const goTo = (next: number) => {
    const safe = (next + images.length) % images.length;
    setIndex(safe);
    pager.current?.scrollTo({ x: safe * width, animated: true });
  };

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {width > 0 ? (
        <View>
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            style={{ height }}
          >
            {images.map((uri) => (
              <Pressable key={uri} style={{ width, height }} onPress={() => setZoomOpen(true)}>
                <Image source={{ uri }} style={{ width, height }} contentFit="contain" transition={150} />
              </Pressable>
            ))}
          </ScrollView>

          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}

          <View style={styles.zoomHint} pointerEvents="none">
            <Ionicons name="search" size={13} color="#fff" />
            <Text style={styles.zoomHintText}>Tap to zoom</Text>
          </View>

          {showArrows ? (
            <>
              <Pressable style={[styles.arrow, { left: 8 }]} onPress={() => goTo(index - 1)} accessibilityLabel="Previous photo">
                <Ionicons name="chevron-back" size={22} color="#18181B" />
              </Pressable>
              <Pressable style={[styles.arrow, { right: 8 }]} onPress={() => goTo(index + 1)} accessibilityLabel="Next photo">
                <Ionicons name="chevron-forward" size={22} color="#18181B" />
              </Pressable>
            </>
          ) : null}
        </View>
      ) : null}

      {images.length > 1 ? (
        <>
          <View style={styles.dots}>
            {images.map((uri, i) => (
              <View key={uri} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
            {images.map((uri, i) => (
              <Pressable key={uri} onPress={() => goTo(i)} style={[styles.thumb, i === index && styles.thumbActive]}>
                <Image source={{ uri }} style={styles.thumbImage} contentFit="cover" />
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      <ImageZoomModal visible={zoomOpen} images={images} index={index} onIndexChange={setIndex} onClose={() => setZoomOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: "#fff", paddingBottom: 12 },
  badge: { position: "absolute", top: 12, left: 12, backgroundColor: "#16A34A", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  zoomHint: { position: "absolute", right: 12, bottom: 12, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  zoomHintText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  arrow: { position: "absolute", top: "42%", width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 5, paddingTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D4D4D8" },
  dotActive: { width: 18, backgroundColor: Brand.primary },
  thumbs: { gap: 8, paddingHorizontal: 12, paddingTop: 10 },
  thumb: { width: 62, height: 62, borderRadius: 10, borderWidth: 2, borderColor: Brand.border, overflow: "hidden", backgroundColor: Brand.surface },
  thumbActive: { borderColor: Brand.primary },
  thumbImage: { width: "100%", height: "100%" },
});
