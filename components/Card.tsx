import { View, Text, Image, StyleSheet } from "react-native";
import { CardType } from "../types/Card";

export default function Card({ card }: { card: CardType }) {
	return (
		<View style={styles.card}>
			<Image source={{ uri: card.image }} style={styles.image} />
			<Text>{card.name}</Text>
			<Text>{card.rarity}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		margin: 10,
	},
	image: {
		width: 120,
		height: 170,
		borderRadius: 10,
	},
});
