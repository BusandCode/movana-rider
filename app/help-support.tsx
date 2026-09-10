import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: "1",
    question: "How do I accept a delivery?",
    answer: "When you're online, available deliveries will appear on your dashboard. Tap 'Accept' on any delivery to accept it. You'll then be able to navigate to the pickup location."
  },
  {
    id: "2",
    question: "How do I go online?",
    answer: "Tap the 'Online' switch on your dashboard. You'll need to enable location permissions first. Once online, you'll start receiving delivery requests."
  },
  {
    id: "3",
    question: "How do I get paid?",
    answer: "Earnings are calculated per delivery and added to your balance. You can withdraw your earnings by adding your bank details in the Bank Info section of your profile."
  },
  {
    id: "4",
    question: "What if I can't complete a delivery?",
    answer: "If you're unable to complete a delivery, tap 'Reject' on the offer or contact support immediately. Repeated cancellations may affect your success rate."
  },
  {
    id: "5",
    question: "How is my success rate calculated?",
    answer: "Your success rate is based on the percentage of deliveries you complete successfully. On-time deliveries and completed trips increase your rate."
  },
  {
    id: "6",
    question: "What documents do I need?",
    answer: "You need a valid Driver's License/Rider ID, Vehicle Registration, and National ID. Upload these in the Documents section of your profile."
  },
];

export default function HelpSupportScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:+234800MOVANA").catch(() => {
      Alert.alert("Error", "Unable to make a call. Please dial +234 800 MOVANA manually.");
    });
  };

  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@movana.com?subject=Movana Rider Support").catch(() => {
      Alert.alert("Error", "Unable to open email app. Please email support@movana.com manually.");
    });
  };

  const handleWhatsAppSupport = () => {
    Linking.openURL("https://wa.me/234800668262?text=Hi%20Movana%20Support").catch(() => {
      Alert.alert("Error", "Unable to open WhatsApp. Please contact +234 800 MOVANA manually.");
    });
  };

  const handleSubmitMessage = () => {
    if (!message.trim()) {
      Alert.alert("Message Required", "Please enter your message before submitting.");
      return;
    }
    setIsSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Message Sent",
        "Thank you for reaching out. Our support team will respond to you shortly.",
        [{ text: "OK", onPress: () => setMessage("") }]
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Contact Options */}
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <View style={styles.contactGrid}>
        <TouchableOpacity style={styles.contactItem} onPress={handleCallSupport}>
          <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="call-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.contactLabel}>Call</Text>
          <Text style={styles.contactValue}>+234 800 MOVANA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleEmailSupport}>
          <View style={[styles.contactIcon, { backgroundColor: `${colors.success}15` }]}>
            <Ionicons name="mail-outline" size={24} color={colors.success} />
          </View>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>support@movana.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleWhatsAppSupport}>
          <View style={[styles.contactIcon, { backgroundColor: "#25D36615" }]}>
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </View>
          <Text style={styles.contactLabel}>WhatsApp</Text>
          <Text style={styles.contactValue}>Chat with us</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqHeader}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionSubtitle}>Find answers to common questions</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* FAQ List */}
      <View style={styles.faqList}>
        {filteredFaqs.length === 0 ? (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsMessage}>Try adjusting your search terms</Text>
          </View>
        ) : (
          filteredFaqs.map((faq) => (
            <Card key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFaq(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              {expandedFaq === faq.id && (
                <View style={styles.faqAnswerContainer}>
                  <View style={styles.faqDivider} />
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </Card>
          ))
        )}
      </View>

      {/* Send Message */}
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Send Us a Message</Text>
      <Text style={styles.sectionSubtitle}>We'll get back to you within 24 hours</Text>

      <Card style={styles.messageCard}>
        <TextInput
          style={styles.messageInput}
          placeholder="Describe your issue..."
          placeholderTextColor={colors.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Button
          label={isSubmitting ? "Sending..." : "Send Message"}
          onPress={handleSubmitMessage}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          style={styles.sendButton}
        />
      </Card>

      {/* Emergency */}
      <View style={styles.emergencyContainer}>
        <Text style={styles.emergencyTitle}>⚠️ Emergency</Text>
        <Text style={styles.emergencyText}>
          If you're in immediate danger or need urgent assistance, please contact emergency services.
        </Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => Linking.openURL("tel:112")}
        >
          <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>Call 112</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>Movana Rider v1.0.0</Text>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },

  // Section
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 16,
  },

  // Contact Grid
  contactGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  contactItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  contactLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.textPrimary,
    textAlign: "center",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    padding: 0,
  },

  // FAQ
  faqHeader: {
    marginBottom: 12,
  },
  faqList: {
    gap: 8,
    marginBottom: 24,
  },
  faqCard: {
    padding: 12,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestionText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  faqDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  faqAnswerContainer: {
    marginTop: 2,
  },
  faqAnswerText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // No Results
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  noResultsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  noResultsMessage: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  // Message
  messageCard: {
    marginBottom: 24,
    gap: 12,
  },
  messageInput: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: "top",
  },
  sendButton: {
    marginTop: 4,
  },

  // Emergency
  emergencyContainer: {
    backgroundColor: `${colors.error}10`,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
    marginBottom: 20,
  },
  emergencyTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    color: colors.error,
    marginBottom: 4,
  },
  emergencyText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  emergencyButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.sm,
    color: "#FFFFFF",
  },

  // Version
  version: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});