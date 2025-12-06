import { View, Text, StyleSheet } from 'react-native';

export default function ReportsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Raporlar (Dashboard)</Text>
            {/* İleride buraya grafikler gelecek */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' },
});