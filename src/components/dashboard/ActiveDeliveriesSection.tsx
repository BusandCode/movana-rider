import { StyleSheet, Text, View, TouchableOpacity, FlatList, useWindowDimensions } from "react-native";
import { useState, useRef } from "react";
import { ActiveDeliveryCard } from "@/components/dashboard/ActiveDeliveryCard";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import type { Delivery } from "@/types/delivery";
import { Ionicons } from "@expo/vector-icons";

interface ActiveDeliveriesSectionProps {
  deliveries: Delivery[];
}

export function ActiveDeliveriesSection({ deliveries }: ActiveDeliveriesSectionProps) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const cardWidth = width - 48; // Account for padding
  
  if (deliveries.length === 0) return null;

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= deliveries.length) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < deliveries.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: cardWidth,
    offset: cardWidth * index,
    index,
  });

  const onScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);
    if (index !== currentIndex && index >= 0 && index < deliveries.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerDot} />
          <Text style={styles.headerTitle}>
            {deliveries.length} active {deliveries.length > 1 ? "deliveries" : "delivery"}
          </Text>
        </View>
        {deliveries.length > 1 && (
          <Text style={styles.headerIndex}>
            {currentIndex + 1} of {deliveries.length}
          </Text>
        )}
      </View>

      <View style={styles.carouselWrapper}>
        <FlatList
          ref={flatListRef}
          data={deliveries}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <View style={[styles.cardContainer, { width: cardWidth }]}>
              <ActiveDeliveryCard
                delivery={item}
                badge={deliveries.length > 1 ? `Active ${index + 1} of ${deliveries.length}` : "Active delivery"}
              />
            </View>
          )}
        />

        {deliveries.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.chevron, styles.chevronLeft, currentIndex === 0 && styles.chevronDisabled]}
              onPress={handlePrev}
              disabled={currentIndex === 0}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={currentIndex === 0 ? colors.border : "#FFFFFF"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.chevron, styles.chevronRight, currentIndex === deliveries.length - 1 && styles.chevronDisabled]}
              onPress={handleNext}
              disabled={currentIndex === deliveries.length - 1}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentIndex === deliveries.length - 1 ? colors.border : "#FFFFFF"} 
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {deliveries.length > 1 && (
        <View style={styles.dots}>
          {deliveries.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    gap: 8, 
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  headerIndex: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  carouselWrapper: {
    position: "relative",
  },
  listContent: {
    paddingHorizontal: 4,
  },
  cardContainer: {
    paddingHorizontal: 4,
  },
  chevron: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  chevronLeft: {
    left: 8,
  },
  chevronRight: {
    right: 8,
  },
  chevronDisabled: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderColor: "rgba(255,255,255,0.05)",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
});