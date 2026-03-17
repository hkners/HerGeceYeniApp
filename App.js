import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 16) / 2; // 48 is horizontal padding, 16 is gap

const DUMMY_DATA = [
  {
    id: '1',
    title: 'Leica M11',
    category: 'Tech',
    height: 220,
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=600&auto=format&fit=crop',
    isAura: true,
  },
  {
    id: '2',
    title: 'Cashmere Sweater',
    category: 'Wardrobe',
    height: 180,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Chemex Classic',
    category: 'Home',
    height: 250,
    image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'MacBook Pro',
    category: 'Tech',
    height: 160,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    isAura: true,
  },
  {
    id: '5',
    title: 'Eames Chair',
    category: 'Furniture',
    height: 200,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Moleskine Diary',
    category: 'Stationery',
    height: 150,
    image: 'https://images.unsplash.com/photo-1531346878377-a541fa4b34f0?q=80&w=600&auto=format&fit=crop',
  },
];

const ItemCard = ({ item }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { height: item.height }]}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        {/* Glassmorphic overlay simulation */}
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        {item.isAura && <View style={styles.auraRing} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  // Split data into two columns for masonry effect
  const leftColumn = DUMMY_DATA.filter((_, i) => i % 2 === 0);
  const rightColumn = DUMMY_DATA.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LUVA</Text>
          <Text style={styles.headerSubtitle}>The Mindful Inventory</Text>
        </View>

        <View style={styles.masonryContainer}>
          <View style={styles.column}>
            {leftColumn.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>
          <View style={styles.column}>
            {rightColumn.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Text style={styles.fabText}>CURATE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Alabaster / Clean Girl aesthetic
  },
  scrollContent: {
    paddingHorizontal: 24, // Airy spacing
    paddingTop: Platform.OS === 'android' ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280', // Muted Slate
    marginTop: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: COLUMN_WIDTH,
    gap: 16,
  },
  cardContainer: {
    width: '100%',
    borderRadius: 20, // Soft corners
    backgroundColor: '#FFFFFF',
    shadowColor: '#E0E7FF', // Soft Periwinkle shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Simulated glassmorphism
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  auraRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FDF2F8', // Champagne Pink glow
    opacity: 0.8,
    pointerEvents: 'none',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  fab: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30, // Pill shape
    shadowColor: '#E0E7FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderTopColor: '#FDF2F8', // Inner glow highlight
  },
  fabText: {
    color: '#1A1A1A',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
