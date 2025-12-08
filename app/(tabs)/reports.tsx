import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ReportsScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Haftalık Özet</Text>

            {/* İstatistik Kartları */}
            <View style={styles.statsContainer}>
                {/* Bugünün Özeti [cite: 28] */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Bugün Odaklanma</Text>
                    <Text style={styles.cardValue}>0 dk</Text>
                </View>

                {/* Toplam Süre [cite: 30] */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Toplam Süre</Text>
                    <Text style={styles.cardValue}>0 sa</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Tamamlanan Seans</Text>
                    <Text style={styles.cardValue}>0</Text>
                </View>
            </View>

            {/* Grafik Alanı (Placeholder) [cite: 32] */}
            <View style={styles.chartPlaceholder}>
                <Text style={styles.placeholderText}>Grafikler Burada Gösterilecek</Text>
                <Text style={styles.subText}>(Bar Chart & Pie Chart)</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1FAEE',
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 20,
        marginTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 10,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 3, // Android gölge
        shadowColor: '#000', // iOS gölge
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardLabel: {
        fontSize: 14,
        color: '#457B9D',
        marginBottom: 5,
        textAlign: 'center',
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#E63946',
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: '#A8DADC',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#457B9D',
        borderStyle: 'dashed',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D3557',
    },
    subText: {
        fontSize: 12,
        color: '#1D3557',
        marginTop: 5,
    },
});