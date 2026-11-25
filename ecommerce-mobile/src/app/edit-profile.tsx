import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { TextField } from "@/components/TextField";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";
import { PAGE_MAX_WIDTH } from "@/hooks/use-responsive";

const GENDERS = ["Male", "Female", "Other"];

type Errors = Partial<Record<"name" | "phone" | "dateOfBirth" | "pincode", string>>;

export default function EditProfile() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [pincode, setPincode] = useState(user?.pincode ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Enter your name";
    if (phone.trim() && !/^[6-9]\d{9}$/.test(phone.trim())) next.phone = "Enter a valid 10-digit mobile number";
    if (dateOfBirth.trim()) {
      const date = new Date(dateOfBirth.trim());
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim()) || Number.isNaN(date.getTime()) || date > new Date()) {
        next.dateOfBirth = "Use the format YYYY-MM-DD (e.g. 1998-04-23)";
      }
    }
    if (pincode.trim() && !/^\d{6}$/.test(pincode.trim())) next.pincode = "Enter a valid 6-digit PIN code";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    setFormError(null);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        gender,
        dateOfBirth: dateOfBirth.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      });
      router.back();
    } catch (e) {
      setFormError(getErrorMessage(e, "Couldn't save your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ title: "Edit profile" }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.section}>Personal information</Text>
          <TextField label="Full name" value={name} onChangeText={setName} autoCapitalize="words" error={errors.name} />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.chips}>
            {GENDERS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setGender(gender === option ? "" : option)}
                style={[styles.chip, gender === option && styles.chipActive]}
              >
                <Text style={[styles.chipText, gender === option && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <TextField
            label="Date of birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            error={errors.dateOfBirth}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Contact details</Text>
          <View style={styles.readOnly}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
            <Text style={styles.hint}>Email is your login ID and can&apos;t be changed.</Text>
          </View>
          <TextField
            label="Mobile number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="10-digit mobile number"
            error={errors.phone}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Delivery address</Text>
          <TextField
            label="Address"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="sentences"
            multiline
            placeholder="House no, building, street, area"
          />
          <TextField label="City" value={city} onChangeText={setCity} autoCapitalize="words" />
          <TextField
            label="PIN code"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
          />
        </View>

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        <View style={styles.buttons}>
          <Pressable onPress={() => router.back()} disabled={saving} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <View style={styles.saveWrap}>
            <PrimaryButton title="Save changes" onPress={save} loading={saving} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#F1F3F6" },
  content: { maxWidth: PAGE_MAX_WIDTH, width: "100%", alignSelf: "center", padding: 12, gap: 10, paddingBottom: 40 },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 14 },
  section: { fontSize: 15, fontWeight: "700", color: "#212121", marginBottom: 14 },
  label: { fontSize: 13, color: "#60646C", marginBottom: 6, fontWeight: "600" },
  value: { fontSize: 15, color: "#212121" },
  hint: { fontSize: 12, color: "#878787", marginTop: 2 },
  readOnly: { marginBottom: 16 },
  chips: { flexDirection: "row", gap: 10, marginBottom: 16 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#ECFCCB", borderColor: Brand.primary },
  chipText: { fontSize: 14, color: "#212121" },
  chipTextActive: { color: Brand.primary, fontWeight: "700" },
  formError: { color: Brand.error, fontSize: 14 },
  buttons: { flexDirection: "row", alignItems: "center", gap: 12 },
  cancel: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: "#fff",
  },
  cancelText: { color: "#212121", fontSize: 16, fontWeight: "600" },
  saveWrap: { flex: 1.4 },
});
