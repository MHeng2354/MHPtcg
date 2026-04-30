import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Card from "../../components/Card";
import { GameContext } from "../../context/GameContext";
import { packs } from "../../data/packs";
import { CardType, PackType } from "../../types/Card";
import { fetchCards } from "../../utils/api";
import { openPack } from "../../utils/pullLogic";

export default function Pack() {
  const { coins, setCoins, addCards } = useContext(GameContext);

  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null);
  const [pulledCards, setPulledCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCards()
      .then(setCards)
      .catch(() => Alert.alert("Error", "Failed to load Pokémon cards."))
      .finally(() => setLoading(false));
  }, []);

  const resetAnimation = () => {
    scaleAnim.setValue(1);
    rotateAnim.setValue(0);
    fadeAnim.setValue(0);
  };

  const handleChoosePack = (pack: PackType) => {
    setSelectedPack(pack);
    setPulledCards([]);
    setShowResult(false);
    resetAnimation();
  };

  const handleOpenPack = () => {
    if (!selectedPack) {
      Alert.alert("Choose Pack", "Please choose a pack first.");
      return;
    }

    if (coins < selectedPack.price) {
      Alert.alert("Not Enough Coins", `You need ${selectedPack.price} coins.`);
      return;
    }

    if (cards.length === 0) {
      Alert.alert("No Cards", "Cards are still loading.");
      return;
    }

    setOpening(true);
    setShowResult(false);
    setCoins(coins - selectedPack.price);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.2,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const result = openPack(cards, selectedPack);
      setPulledCards(result);
      addCards(result);
      setOpening(false);
      setShowResult(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading cards...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose Your Pack</Text>
      <Text style={styles.coins}>Coins: {coins}</Text>

      <FlatList
        data={packs}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packList}
        renderItem={({ item }) => {
          const isSelected = selectedPack?.id === item.id;

          return (
            <Pressable
              style={[styles.packCard, isSelected && styles.selectedPack]}
              onPress={() => handleChoosePack(item)}
            >
              <Image source={{ uri: item.image }} style={styles.packImage} />
              <Text style={styles.packName}>{item.name}</Text>
              <Text style={styles.packPrice}>{item.price} coins</Text>
            </Pressable>
          );
        }}
      />

      {selectedPack && (
        <View style={styles.openSection}>
          <Animated.View
            style={[
              styles.animatedPack,
              {
                transform: [{ scale: scaleAnim }, { rotate }],
              },
            ]}
          >
            <Image source={{ uri: selectedPack.image }} style={styles.bigPackImage} />
          </Animated.View>

          <Pressable
            style={[styles.openButton, opening && styles.disabledButton]}
            onPress={handleOpenPack}
            disabled={opening}
          >
            <Text style={styles.openButtonText}>
              {opening ? "Opening..." : `Open ${selectedPack.name}`}
            </Text>
          </Pressable>
        </View>
      )}

      {showResult && (
        <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
          <Text style={styles.resultTitle}>You Pulled</Text>

          <View style={styles.cardGrid}>
            {pulledCards.map((card, index) => (
              <Card key={`${card.id}-${index}`} card={card} />
            ))}
          </View>

          <Text style={styles.savedText}>Saved into Pokédex</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  coins: {
    fontSize: 18,
    marginBottom: 18,
  },
  packList: {
    gap: 14,
    paddingVertical: 10,
  },
  packCard: {
    width: 150,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPack: {
    borderColor: "#ffcc00",
    backgroundColor: "#fff8d6",
  },
  packImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },
  packName: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  packPrice: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },
  openSection: {
    marginTop: 30,
    alignItems: "center",
  },
  animatedPack: {
    marginBottom: 20,
  },
  bigPackImage: {
    width: 150,
    height: 210,
    borderRadius: 14,
  },
  openButton: {
    backgroundColor: "#e3350d",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  disabledButton: {
    opacity: 0.6,
  },
  openButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultSection: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  savedText: {
    marginTop: 16,
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
});