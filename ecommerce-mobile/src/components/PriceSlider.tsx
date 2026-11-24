import { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";

import { Brand } from "@/constants/theme";
import { formatPrice } from "@/utils/format";

const THUMB = 26;

type Props = {
  min: number;
  max: number;
  step?: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
};

type Live = { low: number; high: number; min: number; max: number; step: number; usable: number; span: number; onChange: (low: number, high: number) => void };

function makeResponder(which: "low" | "high", read: () => Live) {
  let startX = 0;
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      const s = read();
      startX = (((which === "low" ? s.low : s.high) - s.min) / s.span) * s.usable;
    },
    onPanResponderMove: (_e, g) => {
      const s = read();
      const x = Math.min(Math.max(startX + g.dx, 0), s.usable);
      const raw = s.min + (x / s.usable) * s.span;
      const snapped = Math.min(s.max, Math.max(s.min, Math.round(raw / s.step) * s.step));
      if (which === "low") s.onChange(Math.min(snapped, s.high - s.step), s.high);
      else s.onChange(s.low, Math.max(snapped, s.low + s.step));
    },
  });
}

/** Two-handle price range slider you drag with a finger or mouse (works on phone and web). */
export function PriceSlider({ min, max, step = 500, low, high, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const span = Math.max(max - min, 1);
  const usable = Math.max(width - THUMB, 1);

  // PanResponder callbacks are created once, so they read the latest values from a ref.
  const live = useRef<Live>({ low, high, min, max, step, usable, span, onChange });
  useEffect(() => {
    live.current = { low, high, min, max, step, usable, span, onChange };
  });
  // The responders only touch the ref inside drag events, never while rendering.
  /* eslint-disable react-hooks/refs */
  const [lowPan] = useState(() => makeResponder("low", () => live.current));
  const [highPan] = useState(() => makeResponder("high", () => live.current));
  /* eslint-enable react-hooks/refs */

  const toX = (value: number) => ((value - min) / span) * usable;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const lowX = toX(low);
  const highX = toX(high);

  return (
    <View>
      <View style={styles.values}>
        <Text style={styles.value}>{formatPrice(low)}</Text>
        <Text style={styles.value}>{formatPrice(high)}</Text>
      </View>
      <View style={styles.track} onLayout={onLayout}>
        <View style={styles.rail} />
        <View style={[styles.fill, { left: lowX + THUMB / 2, width: Math.max(highX - lowX, 0) }]} />
        <View style={[styles.thumb, { left: lowX }]} {...lowPan.panHandlers} accessibilityLabel="Minimum price" />
        <View style={[styles.thumb, { left: highX }]} {...highPan.panHandlers} accessibilityLabel="Maximum price" />
      </View>
      <View style={styles.values}>
        <Text style={styles.bound}>{formatPrice(min)}</Text>
        <Text style={styles.bound}>{formatPrice(max)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  values: { flexDirection: "row", justifyContent: "space-between" },
  value: { fontSize: 16, fontWeight: "800", color: "#18181B" },
  bound: { fontSize: 11, color: "#A1A1AA" },
  track: { height: 40, justifyContent: "center", marginVertical: 4 },
  rail: { position: "absolute", left: THUMB / 2, right: THUMB / 2, height: 4, borderRadius: 2, backgroundColor: "#E4E4E7" },
  fill: { position: "absolute", height: 4, borderRadius: 2, backgroundColor: Brand.primary },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: Brand.primary,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
    cursor: "grab",
  } as object,
});
