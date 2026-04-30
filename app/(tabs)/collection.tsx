import { useContext } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { GameContext } from "../../context/GameContext";
import { CardType } from "../../types/Card";

export default function Collection() {
  const { collection } = useContext(GameContext);

  const renderItem = ({ item }: { item: CardType }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.rarity}>{item.rarity}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>

      <FlatList
        data={collection}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No cards collected yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "31.5%",
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 0.72,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 32,
  },
  rarity: {
    marginTop: 4,
    fontSize: 11,
    color: "#666",
    textTransform: "capitalize",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});