import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_PACK_KEY = "last_pulled_pack_id";

export async function saveLastPulledPack(packId: string) {
  await AsyncStorage.setItem(LAST_PACK_KEY, packId);
}

export async function loadLastPulledPack() {
  return await AsyncStorage.getItem(LAST_PACK_KEY);
}