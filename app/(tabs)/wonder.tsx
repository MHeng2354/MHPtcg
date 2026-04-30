import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useState, useEffect, useContext } from "react";
import { fetchCards } from "../../utils/api";
import { GameContext } from "../../context/GameContext";
import Card from "../../components/Card";
import { CardType } from "../../types/Card";

export default function Wonder() {
	const { coins, setCoins, addCards } = useContext(GameContext);

	const [options, setOptions] = useState<CardType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCards().then((data) => {
			const shuffled = data.sort(() => 0.5 - Math.random());
			setOptions(shuffled.slice(0, 3));
			setLoading(false);
		});
	}, []);

	const pick = (card: CardType) => {
		if (coins < 5) return;

		setCoins(coins - 5);
		addCards([card]);
	};

	if (loading) return <ActivityIndicator />;

	return (
		<View>
			<Text>Pick 1 (5 coins)</Text>

			{options.map((c, i) => (
				<TouchableOpacity key={i} onPress={() => pick(c)}>
					<Card card={c} />
				</TouchableOpacity>
			))}
		</View>
	);
}
