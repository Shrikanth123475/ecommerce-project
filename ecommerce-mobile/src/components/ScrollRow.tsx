import { useEffect, useRef, type ReactNode } from "react";
import { Platform, ScrollView, type ScrollViewInstance, type StyleProp, type ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

// Horizontal row that scrolls by swiping. In a desktop browser a mouse can't swipe, so there the
// row is made draggable with the mouse (click, hold and drag left/right) like a touch screen.
export function ScrollRow({ children, contentContainerStyle }: Props) {
  const ref = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = (ref.current as unknown as { getScrollableNode?: () => HTMLElement } | null)?.getScrollableNode?.();
    if (!node) return;

    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;

    const onDown = (e: MouseEvent) => {
      dragging = true;
      moved = false;
      startX = e.pageX;
      startLeft = node.scrollLeft;
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      node.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      dragging = false;
    };
    // A drag must not also count as a click on the chip under the cursor.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    node.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    node.addEventListener("click", onClick, true);
    return () => {
      node.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      node.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      overScrollMode="never"
    >
      {children}
    </ScrollView>
  );
}
