import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardType } from "../types/Card";

export const saveCollection = async (collection: CardType[]) => {
	await AsyncStorage.setItem("collection", JSON.stringify(collection));
};

export const loadCollection = async (): Promise<CardType[]> => {
	const data = await AsyncStorage.getItem("collection");
	return data ? JSON.parse(data) : [];
};
