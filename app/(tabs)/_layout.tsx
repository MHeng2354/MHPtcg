import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<Ionicons name="home" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="pack"
				options={{
					title: "Pack",
					tabBarIcon: ({ color }) => (
						<Ionicons name="cube" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="wonder"
				options={{
					title: "Wonder",
					tabBarIcon: ({ color }) => (
						<Ionicons name="sparkles" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="collection"
				options={{
					title: "Pokédex",
					tabBarIcon: ({ color }) => (
						<Ionicons name="albums" size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
