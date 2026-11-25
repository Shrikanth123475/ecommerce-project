import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type ScrollViewInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand } from "@/constants/theme";

type Props = {
  visible: boolean;
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const STEPS = [1, 2, 3, 4];

// Full-screen viewer: tap the picture or use +/- to zoom, drag to look around, arrows / thumbnails to change view.
export function ImageZoomModal({ visible, images, index, onIndexChange, onClose }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const hScroll = useRef<ScrollViewInstance>(null);
  const vScroll = useRef<ScrollViewInstance>(null);

  const zoom = STEPS[step];
  const stageW = width;
  const stageH = height - insets.top - insets.bottom - 150;

  // Start every picture un-zoomed, and re-centre when the zoom level changes.
  useEffect(() => {
    setStep(0);
  }, [index, visible]);

  useEffect(() => {
    if (zoom > 1) {
      requestAnimationFrame(() => {
        hScroll.current?.scrollTo({ x: (stageW * zoom - stageW) / 2, animated: false });
        vScroll.current?.scrollTo({ y: (stageH * zoom - stageH) / 2, animated: false });
      });
    }
  }, [zoom, stageW, stageH]);

  const uri = images[index];
  const go = (delta: number) => onIndexChange((index + delta + images.length) % images.length);

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.counter}>
            {index + 1} / {images.length}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
        </View>

        <View style={{ width: stageW, height: stageH }}>
          <ScrollView
            ref={hScroll}
            horizontal
            scrollEnabled={zoom > 1}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: stageW * zoom }}
          >
            <ScrollView
              ref={vScroll}
              scrollEnabled={zoom > 1}
              showsVerticalScrollIndicator={false}
              maximumZoomScale={4}
              minimumZoomScale={1}
              contentContainerStyle={{ height: stageH * zoom }}
            >
              <Pressable onPress={() => setStep((s) => (s === 0 ? 1 : 0))}>
                <Image source={{ uri }} style={{ width: stageW * zoom, height: stageH * zoom }} contentFit="contain" />
              </Pressable>
            </ScrollView>
          </ScrollView>

          {images.length > 1 ? (
            <>
              <Pressable style={[styles.arrow, { left: 8 }]} onPress={() => go(-1)} accessibilityLabel="Previous photo">
                <Ionicons name="chevron-back" size={26} color="#fff" />
              </Pressable>
              <Pressable style={[styles.arrow, { right: 8 }]} onPress={() => go(1)} accessibilityLabel="Next photo">
                <Ionicons name="chevron-forward" size={26} color="#fff" />
              </Pressable>
            </>
          ) : null}
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.zoomButton} onPress={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <Ionicons name="remove" size={22} color={step === 0 ? "#52525B" : "#fff"} />
          </Pressable>
          <Text style={styles.zoomLabel}>{zoom}x</Text>
          <Pressable
            style={styles.zoomButton}
            onPress={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
          >
            <Ionicons name="add" size={22} color={step === STEPS.length - 1 ? "#52525B" : "#fff"} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
          {images.map((thumb, i) => (
            <Pressable key={thumb} onPress={() => onIndexChange(i)} style={[styles.thumb, i === index && styles.thumbActive]}>
              <Image source={{ uri: thumb }} style={styles.thumbImage} contentFit="cover" />
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.hint}>Tap the photo or use + / − to zoom, drag to move around</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0B0B0C" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  counter: { color: "#D4D4D8", fontSize: 14, fontWeight: "600" },
  arrow: { position: "absolute", top: "45%", width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18, paddingVertical: 8 },
  zoomButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#27272A", alignItems: "center", justifyContent: "center" },
  zoomLabel: { color: "#fff", fontSize: 15, fontWeight: "700", minWidth: 32, textAlign: "center" },
  thumbs: { gap: 8, paddingHorizontal: 16, justifyContent: "center", flexGrow: 1 },
  thumb: { width: 52, height: 52, borderRadius: 8, borderWidth: 2, borderColor: "transparent", overflow: "hidden" },
  thumbActive: { borderColor: Brand.accent },
  thumbImage: { width: "100%", height: "100%" },
  hint: { color: "#71717A", fontSize: 11, textAlign: "center", paddingVertical: 6 },
});
