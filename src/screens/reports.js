import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getSessions } from '../data/database';

const screenWidth = Dimensions.get('window').width;

// RENK PALETİ: "Indigo Flat"
// Göze batmayan, sakin ve profesyonel
const THEME = {
    primary: '#4F46E5',    // Modern İndigo Mavisi
    secondary: '#818CF8',  // Açık İndigo
    background: '#FFFFFF', // Tam Beyaz
    textMain: '#1F2937',   // Koyu Gri (Siyah değil)
    textLight: '#9CA3AF',  // Açık Gri
    chartBar: '#4F46E5',
};

export default function ReportsScreen() {
    const [stats, setStats] = useState({
        todayDuration: 0,
        totalDuration: 0,
        totalDistractions: 0,
        last7DaysData: { labels: [], datasets: [{ data: [] }] },
        categoryData: [],
    });

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const loadStats = () => {
        getSessions((sessions) => {
            if (!sessions) return;

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const oneDay = 24 * 60 * 60 * 1000;

            let todayDur = 0;
            let totalDur = 0;
            let totalDist = 0;
            const categoryMap = {};
            const last7DaysMap = {};

            // 7 Günlük Boş Şablon
            for (let i = 0; i <= 7; i++) {
                const d = new Date(now.getTime() - (i * oneDay));
                const dateStr = d.toISOString().split('T')[0];
                // Sadece gün ismini al (Pzt, Sal) - Daha minimalist
                const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' }).replace('.', '');
                last7DaysMap[dateStr] = { label: dayName, duration: 0 };
            }

            sessions.forEach(session => {
                const duration = session.duration || 0;
                const dist = session.distractionCount || 0;
                const cat = session.category_name;
                const dateStr = session.date.split('T')[0];

                totalDur += duration;
                totalDist += dist;
                if (dateStr === todayStr) todayDur += duration;

                categoryMap[cat] = (categoryMap[cat] || 0) + duration;
                if (last7DaysMap[dateStr]) last7DaysMap[dateStr].duration += duration;
            });

            // Grafik verilerini hazırla
            const barLabels = [];
            const barData = [];
            Object.keys(last7DaysMap).sort().forEach(k => {
                barLabels.push(last7DaysMap[k].label);
                barData.push(last7DaysMap[k].duration);
            });

            // Minimalist Pasta Renkleri
            const pieColors = ['#4F46E5', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];
            const formattedCategoryData = Object.keys(categoryMap).map((cat, index) => ({
                name: cat,
                population: categoryMap[cat],
                color: pieColors[index % pieColors.length],
                legendFontColor: THEME.textMain,
                legendFontSize: 12,
            }));

            setStats({
                todayDuration: todayDur,
                totalDuration: totalDur,
                totalDistractions: totalDist,
                last7DaysData: { labels: barLabels, datasets: [{ data: barData }] },
                categoryData: formattedCategoryData,
            });
        });
    };

    const formatTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h === 0) return `${m} dk`;
        return `${h}sa ${m}dk`;
    };

    // Çok sade grafik ayarı (Çizgiler yok, arka plan yok)
    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // İndigo rengi
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // Gri metin
        barPercentage: 0.5,
        propsForBackgroundLines: { strokeWidth: 0 }, // Yatay çizgileri tamamen kaldırıyoruz
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />

            {/* 1. ÜST BÖLÜM (HEADER) - Renkli Alan */}
            {/* Kart yok, sadece düz renk zemin üzerine büyük tipografi */}
            <View style={styles.headerArea}>
                <Text style={styles.headerLabel}>BUGÜNKÜ ODAK</Text>
                <Text style={styles.bigNumber}>{formatTime(stats.todayDuration)}</Text>

                {/* Alt İstatistikler - Yatay Çizgi Şeklinde */}
                <View style={styles.headerStatsRow}>
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatLabel}>TOPLAM SÜRE</Text>
                        <Text style={styles.headerStatValue}>{formatTime(stats.totalDuration)}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatLabel}>DAĞILMA</Text>
                        <Text style={styles.headerStatValue}>{stats.totalDistractions} kez</Text>
                    </View>
                </View>
            </View>

            {/* 2. ALT BÖLÜM (BODY) - Beyaz Alan */}
            <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>

                {/* Çubuk Grafik */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Haftalık Performans</Text>
                    <BarChart
                        data={stats.last7DaysData}
                        width={screenWidth} // Tam genişlik
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showBarTops={false}
                        fromZero
                        withInnerLines={false} // İç çizgileri kapat
                        withHorizontalLabels={false} // Soldaki sayıları kapat (daha sade olsun)
                        showValuesOnTopOfBars={true} // Değerler çubuğun üstünde yazsın
                        style={{ paddingRight: 0, marginLeft: -20 }} // Grafiği sola yanaştır
                    />
                </View>

                {/* Pasta Grafik */}
                <View style={[styles.sectionContainer, { paddingBottom: 50 }]}>
                    <Text style={styles.sectionTitle}>Kategori Dağılımları</Text>
                    {stats.categoryData.length > 0 ? (
                        <PieChart
                            data={stats.categoryData}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={'population'}
                            backgroundColor={'transparent'}
                            paddingLeft={'20'}
                            center={[10, 0]}
                            absolute={false} // Yüzde olarak göster
                        />
                    ) : (
                        <Text style={styles.emptyText}>Henüz veri yok.</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    // ÜST KISIM TASARIMI
    headerArea: {
        backgroundColor: THEME.primary,
        paddingTop: 60, // Status bar boşluğu
        paddingBottom: 40,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 30, // Köşeleri yuvarlatarak modern hava katıyoruz
        borderBottomRightRadius: 30,
        alignItems: 'center',
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        zIndex: 10,
    },
    headerLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    bigNumber: {
        color: '#FFFFFF',
        fontSize: 56, // Devasa font
        fontWeight: '300', // İnce font (Daha şık durur)
        letterSpacing: -1,
        marginBottom: 25,
    },
    headerStatsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)', // Yarı saydam arka plan
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerStatItem: {
        alignItems: 'center',
    },
    headerStatLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 2,
    },
    headerStatValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    verticalDivider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },

    // ALT KISIM TASARIMI
    contentArea: {
        flex: 1,
        paddingTop: 30,
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.textMain,
        marginLeft: 20,
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    emptyText: {
        textAlign: 'center',
        color: THEME.textLight,
        marginTop: 20,
    },
});