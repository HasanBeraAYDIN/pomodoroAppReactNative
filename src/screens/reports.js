import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getSessions } from '../data/database';

const screenWidth = Dimensions.get('window').width;

// RENK PALETİ
const THEME = {
    primary: '#4F46E5',
    secondary: '#818CF8',
    background: '#FFFFFF',
    textMain: '#1F2937',
    textLight: '#9CA3AF',
    chartBar: '#4F46E5',
};

export default function ReportsScreen() {
    const [stats, setStats] = useState({
        todayDuration: 0,
        totalDuration: 0,
        todayDistractions: 0,
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
            let todayDist = 0;

            const categoryMap = {};
            const last7DaysMap = {};

            // Gün isimleri (Pzt, Sal...)
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now.getTime() - (i * oneDay));
                const dateStr = d.toISOString().split('T')[0];

                // Kısa gün ismini al (Pzt, Sal)
                const dayLabel = d.toLocaleDateString('tr-TR', { weekday: 'short' }).replace('.', '');

                last7DaysMap[dateStr] = { label: dayLabel, duration: 0 };
            }

            sessions.forEach(session => {
                const duration = session.duration || 0;
                const dist = session.distractionCount || 0;
                const cat = session.category_name;
                const dateStr = session.date.split('T')[0];

                totalDur += duration;

                if (dateStr === todayStr) {
                    todayDur += duration;
                    todayDist += dist;
                }
                if (last7DaysMap[dateStr]) {
                    last7DaysMap[dateStr].duration += duration;
                    categoryMap[cat] = (categoryMap[cat] || 0) + duration;
                }
            });

            const barLabels = [];
            const barData = [];
            Object.keys(last7DaysMap).sort().forEach(k => {
                barLabels.push(last7DaysMap[k].label);
                barData.push(last7DaysMap[k].duration);
            });

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
                todayDistractions: todayDist,
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

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        barPercentage: 0.6,
        propsForBackgroundLines: { strokeWidth: 0 },
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />

            {/* ÜST BÖLÜM */}
            <View style={styles.headerArea}>
                <Text style={styles.headerLabel}>BUGÜNKÜ ODAK</Text>
                <Text style={styles.bigNumber}>{formatTime(stats.todayDuration)}</Text>

                <View style={styles.headerStatsRow}>
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatLabel}>TOPLAM SÜRE</Text>
                        <Text style={styles.headerStatValue}>{formatTime(stats.totalDuration)}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatLabel}>BU GÜNKİ TOPLAM DAĞILMA</Text>
                        <Text style={styles.headerStatValue}>{stats.todayDistractions} kez</Text>
                    </View>
                </View>
            </View>

            {/* ALT BÖLÜM */}
            <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>

                {/* Çubuk Grafik */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Haftalık Performans</Text>

                    <BarChart
                        data={stats.last7DaysData}
                        width={screenWidth}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showBarTops={false}
                        fromZero
                        withInnerLines={false}
                        withHorizontalLabels={false}
                        showValuesOnTopOfBars={true}
                        style={{
                            borderRadius: 16,
                            alignSelf: 'center', // Ortala
                            marginTop: 10
                        }}
                    />
                </View>

                {/* Pasta Grafik */}
                <View style={[styles.sectionContainer, { paddingBottom: 50 }]}>
                    <Text style={styles.sectionTitle}>Haftalık Kategori Dağılımı</Text>
                    {stats.categoryData.length > 0 ? (
                        <PieChart
                            data={stats.categoryData}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={'population'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                            center={[0, 0]}
                            absolute={false}
                        />
                    ) : (
                        <Text style={styles.emptyText}>Bu hafta henüz veri yok.</Text>
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
    headerArea: {
        backgroundColor: THEME.primary,
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 30,
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
        fontSize: 56,
        fontWeight: '300',
        letterSpacing: -1,
        marginBottom: 25,
    },
    headerStatsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
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
    contentArea: {
        flex: 1,
        paddingTop: 30,
    },
    sectionContainer: {
        marginBottom: 30,
        alignItems: 'flex-start',
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