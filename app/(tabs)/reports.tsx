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
        backgroundColor: '#F8FAFB',
        padding: 20,
        marginTop: 50
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 25,
        marginTop: 10,
        letterSpacing: 0.5,
    },

    /* --- KART ALANLARI --- */
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 15,
    },

    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 25,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',

        // Modern gölge
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 4,
    },

    cardLabel: {
        fontSize: 15,
        color: '#457B9D',
        marginBottom: 8,
        fontWeight: '500',
        letterSpacing: 0.3,
        textAlign: 'center',
    },

    cardValue: {
        fontSize: 26,
        fontWeight: '700',
        color: '#E63946',
        letterSpacing: 0.5,
    },

    /* --- GRAFİK ALANI (Placeholder) --- */
    chartPlaceholder: {
        height: 230,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 20,

        // Modern kenarlık + gölge
        borderWidth: 1,
        borderColor: '#E5E5E5',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },

    placeholderText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 4,
    },

    subText: {
        fontSize: 13,
        color: '#457B9D',
    },
});
