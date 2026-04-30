import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { fetchCardsBySet } from "../../utils/api";
import { loadLastPulledPack, saveLastPulledPack } from "../../utils/packStorage";
import { openPack } from "../../utils/pullLogic";

type CardCache = Record<string, CardType[]>;

export default function Pack() {
  const { coins, unlimitedCoins, spendCoins, addCards } = useContext(GameContext);

  const scrollRef = useRef<ScrollView | null>(null);

  const [selectedPack, setSelectedPack] = useState<PackType | null>(null);
  const [lastPackId, setLastPackId] = useState<string | null>(null);
  const [pulledCards, setPulledCards] = useState<CardType[]>([]);
  const [cardCache, setCardCache] = useState<CardCache>({});
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [openingPack, setOpeningPack] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [godPackChance, setGodPackChance] = useState(0.05);
  const [isGodPack, setIsGodPack] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const savedPackId = await loadLastPulledPack();
        const savedPack = packs.find((pack) => pack.id === savedPackId);
        const defaultPack = savedPack ?? packs[0];

        setLastPackId(savedPack?.id ?? null);
        setSelectedPack(defaultPack);

        const results = await Promise.all(
          packs.map(async (pack) => {
            const cards = await fetchCardsBySet(pack.setId);
            return [pack.id, cards] as const;
          })
        );

        const nextCache: CardCache = {};

        results.forEach(([packId, cards]) => {
          nextCache[packId] = cards;
        });

        setCardCache(nextCache);
      } catch {
        Alert.alert("Error", "Failed to load Pokémon packs.");
      } finally {
        setLoadingPacks(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (showResult) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [showResult, pulledCards]);

  const displayPacks = useMemo(() => {
    if (!lastPackId) return packs;

    const lastPack = packs.find((pack) => pack.id === lastPackId);
    const otherPacks = packs.filter((pack) => pack.id !== lastPackId);

    return lastPack ? [lastPack, ...otherPacks] : packs;
  }, [lastPackId]);

  const handleChoosePack = (pack: PackType) => {
    if (openingPack) return;

    setSelectedPack(pack);
    setPulledCards([]);
    setShowResult(false);
    setIsGodPack(false);
  };

  const handleOpenPack = async () => {
    if (!selectedPack) {
      Alert.alert("Choose Pack", "Please choose a pack first.");
      return;
    }

    const ok = spendCoins(selectedPack.price);

    if (!ok) {
      Alert.alert("Not Enough Coins", `You need ${selectedPack.price} coins.`);
      return;
    }

    const cards = cardCache[selectedPack.id];

    if (!cards || cards.length === 0) {
      Alert.alert("No Cards", "Cards for this pack are not ready yet.");
      return;
    }

    setOpeningPack(true);
    setShowResult(false);

    const result = openPack(cards, godPackChance);

    setPulledCards(result.cards);
    addCards(result.cards);
    setIsGodPack(result.isGodPack);
    setLastPackId(selectedPack.id);
    await saveLastPulledPack(selectedPack.id);

    if (result.isGodPack) {
      setGodPackChance(0.05);
    } else {
      setGodPackChance((prev) => Math.min(prev + 0.001, 1));
    }

    setShowResult(true);
    setOpeningPack(false);
  };

  const coinText = unlimitedCoins ? "∞" : String(coins);
  const selectedCardsReady = selectedPack ? !!cardCache[selectedPack.id]?.length : false;

  if (loadingPacks) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading Pokémon packs...</Text>
      </View>
    );
  }

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pull Pokémon Pack</Text>
      <Text style={styles.coins}>Coins: {coinText}</Text>
      <Text style={styles.godPackChance}>
        God Pack Chance: {(godPackChance * 100).toFixed(1)}%
      </Text>

      <FlatList
        data={displayPacks}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packList}
        renderItem={({ item, index }) => {
          const isSelected = selectedPack?.id === item.id;
          const isLastPack = item.id === lastPackId && index === 0;
          const isReady = !!cardCache[item.id]?.length;

          return (
            <Pressable
              style={[
                styles.packCard,
                isSelected && styles.selectedPack,
                !isReady && styles.notReadyPack,
              ]}
              onPress={() => handleChoosePack(item)}
            >
              {isLastPack && <Text style={styles.lastBadge}>Last Pack</Text>}

              <Image source={item.image} style={styles.packImage} resizeMode="cover" />

              <Text style={styles.packName}>{item.name}</Text>

              <Text style={styles.packPrice}>
                {isReady ? (unlimitedCoins ? "Free" : `${item.price} coins`) : "Loading"}
              </Text>
            </Pressable>
          );
        }}
      />

      {selectedPack && (
        <View style={styles.openSection}>
          <Image
            source={selectedPack.image}
            style={styles.bigPackImage}
            resizeMode="cover"
          />

          <Pressable
            style={[
              styles.openButton,
              (openingPack || !selectedCardsReady) && styles.disabledButton,
            ]}
            onPress={handleOpenPack}
            disabled={openingPack || !selectedCardsReady}
          >
            {openingPack ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.openButtonText}>
                {selectedCardsReady ? `Open ${selectedPack.name}` : "Loading Pack..."}
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {showResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>
            {isGodPack ? "GOD PACK!" : "You Pulled"}
          </Text>

          <View style={styles.cardGrid}>
            {pulledCards.map((card, index) => (
              <Card key={`${card.id}-${index}`} card={card} />
            ))}
          </View>

          <Text style={styles.savedText}>Saved into Pokédex</Text>

          <Pressable
            style={[styles.pullAgainButton, openingPack && styles.disabledButton]}
            onPress={handleOpenPack}
            disabled={openingPack}
          >
            {openingPack ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.pullAgainButtonText}>Pull Again</Text>
            )}
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
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
    marginBottom: 6,
  },
  godPackChance: {
    fontSize: 15,
    color: "#b8860b",
    fontWeight: "bold",
    marginBottom: 12,
  },
  packList: {
    gap: 14,
    paddingVertical: 10,
  },
  packCard: {
    width: 150,
    minHeight: 225,
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
  notReadyPack: {
    opacity: 0.6,
  },
  lastBadge: {
    position: "absolute",
    top: 6,
    zIndex: 2,
    backgroundColor: "#e3350d",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "bold",
  },
  packImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
    marginTop: 12,
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
    marginTop: 26,
    alignItems: "center",
  },
  bigPackImage: {
    width: 160,
    height: 225,
    borderRadius: 14,
    marginBottom: 16,
  },
  openButton: {
    minWidth: 210,
    backgroundColor: "#e3350d",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
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
  pullAgainButton: {
    marginTop: 18,
    minWidth: 210,
    backgroundColor: "#3761a8",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
  },
  pullAgainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});