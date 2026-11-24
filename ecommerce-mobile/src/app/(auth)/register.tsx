import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthLayout } from "@/components/AuthLayout";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextField } from "@/components/TextField";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";

type Errors = { name?: string; email?: string; password?: string; form?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = "Enter your name";
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid email";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUp({ name: name.trim(), email, password, address: address.trim() });
    } catch (error) {
      setErrors({ form: getErrorMessage(error, "Sign up failed. Please try again.") });
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout compact title="Create account" subtitle="Sign up with your details to get started">
      <TextField label="Full name" value={name} onChangeText={setName} autoCapitalize="words" error={errors.name} />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        error={errors.password}
      />
      <TextField
        label="Address (optional)"
        value={address}
        onChangeText={setAddress}
        autoCapitalize="sentences"
        multiline
        onSubmitEditing={handleRegister}
      />
      {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}
      <PrimaryButton title="Create account" onPress={handleRegister} loading={submitting} tone="dark" />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already a user? </Text>
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  formError: { color: Brand.error, marginBottom: 12, fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#60646C", fontSize: 14 },
  link: { color: Brand.primary, fontWeight: "700", fontSize: 14 },
});
