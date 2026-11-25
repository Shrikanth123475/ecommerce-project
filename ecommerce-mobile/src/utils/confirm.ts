import { Alert, Platform } from "react-native";

export type DialogRequest = {
  title: string;
  message: string;
  /** Present for confirmations (two buttons); absent for plain alerts (one button). */
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "info" | "danger" | "success";
  resolve: (confirmed: boolean) => void;
};

let showDialog: ((request: DialogRequest | null) => void) | null = null;

// DialogProvider registers itself here so these plain functions can open the in-app popup.
export function registerDialogHandler(handler: ((request: DialogRequest | null) => void) | null) {
  showDialog = handler;
}

/** One-button popup for things the user must notice (stock problems etc.). */
export function showAlert(title: string, message: string) {
  if (showDialog) {
    showDialog({ title, message, tone: "info", resolve: () => {} });
    return;
  }
  if (Platform.OS === "web") window.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message, [{ text: "OK" }]);
}

/**
 * Friendly success popup with two choices (e.g. "Continue shopping" / "View order").
 * Resolves true if the main button was pressed, false for the secondary button or when dismissed.
 */
export function showSuccess(title: string, message: string, mainLabel: string, otherLabel: string): Promise<boolean> {
  if (showDialog) {
    const open = showDialog;
    return new Promise((resolve) =>
      open({ title, message, confirmLabel: mainLabel, cancelLabel: otherLabel, tone: "success", resolve }),
    );
  }
  return confirmAction(title, message, mainLabel, otherLabel);
}

export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string,
  cancelLabel = "Keep",
): Promise<boolean> {
  if (showDialog) {
    const open = showDialog;
    return new Promise((resolve) => open({ title, message, confirmLabel, cancelLabel, tone: "danger", resolve }));
  }
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: "cancel", onPress: () => resolve(false) },
        { text: confirmLabel, style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
