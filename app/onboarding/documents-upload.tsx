import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ridersApi } from "@/api/endpoints/riders.api";

interface Document {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: "pending" | "uploaded" | "approved" | "rejected";
  uri?: string;
  fileUrl?: string;
}

const REQUIRED_DOCUMENTS: Document[] = [
  {
    key: "drivers_license",
    label: "Driver's License",
    icon: "card-outline",
    status: "pending",
  },
  {
    key: "vehicle_registration",
    label: "Vehicle Registration",
    icon: "car-outline",
    status: "pending",
  },
  {
    key: "national_id",
    label: "National ID",
    icon: "id-card-outline",
    status: "pending",
  },
];

export default function DocumentsUploadScreen() {
  const [documents, setDocuments] = useState<Document[]>(REQUIRED_DOCUMENTS);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Load saved documents from backend
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const { data } = await ridersApi.getDocuments();
      const docs = Array.isArray(data) ? data : data?.data ?? [];

      // Update local state with saved documents
      setDocuments((prev) =>
        prev.map((doc) => {
          const saved = docs.find((d: any) => d.documentType === doc.key);
          if (saved) {
            return {
              ...doc,
              status: saved.status === "approved" ? "approved" : "uploaded",
              fileUrl: saved.fileUrl,
            };
          }
          return doc;
        })
      );
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickDocument = async (key: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Needed",
        "Please allow access to your photo library to upload documents."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setUploadingKey(key);

    try {
      // ✅ Upload to backend
      const formData = new FormData();
      formData.append("documentType", key);
      formData.append("file", {
        uri,
        name: `${key}.jpg`,
        type: "image/jpeg",
      } as any);

      await ridersApi.uploadDocument(formData);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.key === key
            ? { ...doc, status: "uploaded", uri }
            : doc
        )
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      Alert.alert("Upload Failed", error?.message || "Could not upload document. Please try again.");
    } finally {
      setUploadingKey(null);
    }
  };

  const removeDocument = (key: string) => {
    Alert.alert(
      "Remove Document",
      "Are you sure you want to remove this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.key === key
                  ? { ...doc, status: "pending", uri: undefined, fileUrl: undefined }
                  : doc
              )
            );
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return colors.success;
      case "rejected":
        return colors.error;
      case "uploaded":
        return colors.warning;
      default:
        return colors.border;
    }
  };

  const getStatusLabel = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "uploaded":
        return "Pending Review";
      default:
        return "Missing";
    }
  };

  const allUploaded = documents.every((doc) => doc.status !== "pending");
  const allApproved = documents.every((doc) => doc.status === "approved");

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <Text style={styles.subtitle}>
        Upload clear photos of each document. Verification is required before you can accept deliveries.
      </Text>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            {documents.filter((d) => d.status === "uploaded" || d.status === "approved").length} of{" "}
            {documents.length} uploaded
          </Text>
          {allApproved && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  (documents.filter((d) => d.status === "uploaded" || d.status === "approved")
                    .length /
                    documents.length) *
                  100
                }%`,
              },
            ]}
          />
        </View>
      </Card>

      {documents.map((doc) => (
        <Card key={doc.key} style={styles.docCard}>
          <View style={styles.docHeader}>
            <View style={styles.docIconContainer}>
              <Ionicons name={doc.icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docLabel}>{doc.label}</Text>
              <Badge
                label={getStatusLabel(doc.status)}
                color={getStatusColor(doc.status)}
              />
            </View>
          </View>

          {doc.uri && (
            <TouchableOpacity onPress={() => removeDocument(doc.key)}>
              <Image source={{ uri: doc.uri }} style={styles.preview} />
              <View style={styles.removeBadge}>
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )}

          <Button
            label={doc.uri ? "Replace" : "Upload"}
            variant={doc.uri ? "outline" : "primary"}
            onPress={() => pickDocument(doc.key)}
            isLoading={uploadingKey === doc.key}
            style={{ marginTop: 12 }}
            disabled={doc.status === "approved"}
          />

          {doc.status === "approved" && (
            <View style={styles.approvedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.approvedText}>Verified</Text>
            </View>
          )}
        </Card>
      ))}

      {allUploaded && !allApproved && (
        <Button
          label="Submit for Review"
          onPress={() => {
            Alert.alert(
              "Documents Submitted",
              "Your documents have been submitted for review. You'll be notified once verified.",
              [{ text: "OK", onPress: () => router.back() }]
            );
          }}
          style={{ marginTop: 16 }}
        />
      )}

      {allApproved && (
        <View style={styles.completeContainer}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          <Text style={styles.completeText}>All Documents Verified!</Text>
          <Text style={styles.completeSubtext}>
            You're all set to start accepting deliveries.
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  summaryCard: {
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.success,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  docCard: {
    marginBottom: 12,
  },
  docHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  docIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
    alignItems: "center",
    justifyContent: "center",
  },
  docInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  preview: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginTop: 12,
  },
  removeBadge: {
    position: "absolute",
    top: 20,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  approvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    justifyContent: "center",
  },
  approvedText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.success,
  },
  completeContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  completeText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.success,
  },
  completeSubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
});