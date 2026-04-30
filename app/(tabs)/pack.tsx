import { View, Button, ActivityIndicator } from "react-native";
import { useState, useContext, useEffect } from "react";
import { GameContext } from "../../context/GameContext";
import { openPack } from "../../utils/pullLogic";
import { fetchCards } from "../../utils/api";
import Card from "../../components/Card";
import { CardType } from "../../types/Card";

export default function Pack() {
	const { coins, setCoins, addCards } = useContext(GameContext);

	const [cards, setCards] = useState<CardType[]>([]);
	const [pulled, setPulled] = useState<CardType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCards().then((data) => {
			setCards(data);
			setLoading(false);
		});
	}, []);

	const handleOpen = () => {
		if (coins < 10 || cards.length === 0) return;

		setCoins(coins - 10);

		const result = openPack(cards);
		setPulled(result);
		addCards(result);
	};

	if (loading) return <ActivityIndicator size="large" />;

	return (
		<View>
			<Button title={`Open Pack (${coins} coins)`} onPress={handleOpen} />

			{pulled.map((c, i) => (
				<Card key={i} card={c} />
			))}
		</View>
	);
}
