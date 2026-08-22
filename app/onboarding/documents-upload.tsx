import { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ridersApi } from "@/api/endpoints/riders.api";

const REQUIRED_DOCUMENTS = [
  { key: "drivers_license", label: "Driver's License / Rider ID" },
  { key: "vehicle_registration", label: "Vehicle Registration" },
  { key: "national_id", label: "National ID" },
] as const;

type DocKey = (typeof REQUIRED_DOCUMENTS)[number]["key"];

export default function DocumentsUploadScreen() {
  const [uploads, setUploads] = useState<Partial<Record<DocKey, string>>>({});
  const [uploadingKey, setUploadingKey] = useState<DocKey | null>(null);

  const pickDocument = async (key: DocKey) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Enable photo library access to upload documents.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setUploads((prev) => ({ ...prev, [key]: uri }));

    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("documentType", key);
      formData.append("file", { uri, name: `${key}.jpg`, type: "image/jpeg" } as any);
      await ridersApi.uploadDocument(formData);
    } catch {
      Alert.alert("Upload failed", "Could not upload this document. Try again.");
      setUploads((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.intro}>
        Upload clear photos of each document. Verification is required before you can accept deliveries.
      </Text>

      {REQUIRED_DOCUMENTS.map((doc) => (
        <Card key={doc.key} style={styles.docCard}>
          <View style={styles.docHeader}>
            <Text style={styles.docLabel}>{doc.label}</Text>
            <Badge
              label={uploads[doc.key] ? "Uploaded" : "Missing"}
              color={uploads[doc.key] ? colors.success : colors.warning}
            />
          </View>

          {uploads[doc.key] && <Image source={{ uri: uploads[doc.key] }} style={styles.preview} />}

          <Button
            label={uploads[doc.key] ? "Replace" : "Upload"}
            variant="outline"
            onPress={() => pickDocument(doc.key)}
            isLoading={uploadingKey === doc.key}
            style={{ marginTop: 12 }}
          />
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.background, flexGrow: 1 },
  intro: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 20 },
  docCard: { marginBottom: 14 },
  docHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  docLabel: { fontFamily: fonts.semiBold, fontSize: fontSize.sm, color: colors.textPrimary },
  preview: { width: "100%", height: 140, borderRadius: 10, marginTop: 12 },
});
