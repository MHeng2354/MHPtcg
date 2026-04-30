import { FlatList } from "react-native";
import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import Card from "../../components/Card";

export default function Collection() {
	const { collection } = useContext(GameContext);

	return (
		<FlatList
			data={collection}
			renderItem={({ item }) => <Card card={item} />}
			keyExtractor={(_, i) => i.toString()}
		/>
	);
}
