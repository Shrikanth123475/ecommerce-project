import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.detail}>{user?.email}</Text>
      {user?.address ? <Text style={styles.detail}>{user.address}</Text> : null}
      <View style={styles.logout}>
        <PrimaryButton title="Logout" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 24 },
  detail: { fontSize: 16, color: "#60646C", marginTop: 6 },
  logout: { marginTop: 32 },
});
