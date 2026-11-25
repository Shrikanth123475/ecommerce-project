import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthLayout } from "@/components/AuthLayout";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextField } from "@/components/TextField";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Enter your email";
    if (!password) nextErrors.password = "Enter your password";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setErrors({ form: getErrorMessage(error, "Login failed. Please try again.") });
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Get access to your orders, cart and recommendations">
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
        autoComplete="off"
        textContentType="none"
        error={errors.password}
        onSubmitEditing={handleLogin}
      />
      {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}
      <PrimaryButton title="Sign In" onPress={handleLogin} loading={submitting} tone="dark" />
      <View style={styles.footer}>
        <Text style={styles.footerText}>New to ShopEase? </Text>
        <Link href="/register" style={styles.link}>
          Create an account
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
