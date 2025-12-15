import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, AppState, Alert, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { initDB, addSession } from '../data/database';

// --- TEMA RENKLERİ ---
const THEME = {
    primary: '#4F46E5',     // Modern İndigo
    secondary: '#E0E7FF',   // Çok açık İndigo (Arka planlar için)
    background: '#F8FAFC',  // Kırık Beyaz / Gri
    textMain: '#1E293B',    // Koyu Slate
    textSub: '#64748B',     // Gri Metin
    white: '#FFFFFF',
    danger: '#EF4444',      // Kırmızı
    success: '#10B981'      // Yeşil
};

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
};

const DEFAULT_TIME = 25 * 60;

const CATEGORIES = [
    { id: '1', name: 'Ders Çalışma' },
    { id: '2', name: 'Kodlama' },
    { id: '3', name: 'Kitap Okuma' },
    { id: '4', name: 'Proje' },
];

export default function HomeScreen() {
    // --- MANTIK KISMI AYNEN KORUNDU ---
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
    const [isActive, setIsActive] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(DEFAULT_TIME);
    const [distractionCount, setDistractionCount] = useState(0);
    const appState = useRef(AppState.currentState);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        initDB();
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            handleSessionComplete();
        }
        return () => {
            if (interval) clearInterval(interval);
        }
    }, [isActive, timeLeft]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/active/) &&
                nextAppState.match(/inactive|background/) &&
                isActive
            ) {
                setIsActive(false);
                setDistractionCount(prev => prev + 1);
                Alert.alert("Dikkat Dağınıklığı!", "Uygulamadan çıktığınız için sayaç duraklatıldı.");
            }
            appState.current = nextAppState;
        });
        return () => subscription.remove();
    }, [isActive]);

    const handleSessionComplete = () => {
        const categoryName = selectedCategory?.name || 'Genel';
        const durationInMinutes = Math.floor(sessionDuration / 60);
        addSession(categoryName, durationInMinutes, distractionCount);
        Alert.alert(
            "Tebrikler! 🎉",
            `Seans Tamamlandı.\nKategori: ${categoryName}\nSüre: ${durationInMinutes} dk\nDikkat Dağınıklığı: ${distractionCount} kez`,
            [{ text: "Tamam", onPress: resetTimer }]
        );
    };

    const adjustTime = (minutes) => {
        setTimeLeft(prev => {
            const newTime = prev + minutes * 60;
            const finalTime = newTime > 0 ? newTime : 0;
            setSessionDuration(finalTime);
            return finalTime;
        });
    };

    const toggleTimer = () => {
        if (!isActive && !selectedCategory) {
            Alert.alert("Uyarı", "Lütfen başlamadan önce bir kategori seçin.");
            return;
        }
        setIsActive(prev => !prev);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(DEFAULT_TIME);
        setDistractionCount(0);
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

            <Text style={styles.headerTitle}>ODAKLANMA</Text>

            {distractionCount > 0 && (
                <View style={styles.alertContainer}>
                    <AntDesign name="warning" size={16} color={THEME.danger} />
                    <Text style={styles.alertText}>
                        Dikkat Dağınıklığı: {distractionCount}
                    </Text>
                </View>
            )}

            <View style={styles.timerWrapper}>
                {/* Sol Buton */}
                <TouchableOpacity style={styles.adjustmentButton} disabled={isActive} onPress={() => adjustTime(-1)}>
                    <AntDesign name="minus" size={24} color={THEME.primary} />
                </TouchableOpacity>

                {/* ORTA SAYAÇ (Daha Kalın Çerçeve) */}
                <View style={[styles.timerContainer, isActive && styles.timerActiveBorder]}>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>

                {/* Sağ Buton */}
                <TouchableOpacity style={styles.adjustmentButton} disabled={isActive} onPress={() => adjustTime(1)}>
                    <AntDesign name="plus" size={24} color={THEME.primary} />
                </TouchableOpacity>
            </View>

            {/* KATEGORİ SEÇİCİ  */}
            <TouchableOpacity style={styles.categorySelector} onPress={() => setModalVisible(true)}>
                <View style={styles.categoryIconBg}>
                    <AntDesign name="tag" size={20} color={THEME.primary} />
                </View>
                <Text style={styles.categorySelectorText}>
                    {selectedCategory ? selectedCategory.name : 'Bir Kategori Seç'}
                </Text>
                <AntDesign name="down" size={14} color={THEME.textSub} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            {/* BUTONLAR */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.startButton, isActive && styles.stopButton]}
                    onPress={toggleTimer}
                >
                    <AntDesign name={isActive ? "pause" : "caretright"} size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>{isActive ? 'Duraklat' : 'Başlat'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
                    <Text style={[styles.buttonText, { color: THEME.primary }]}>Sıfırla</Text>
                </TouchableOpacity>
            </View>

            {/* MODEL */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Kategori Seçiniz</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name="close" size={24} color={THEME.textMain} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={CATEGORIES}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.modalItem, selectedCategory?.id === item.id && styles.modalItemSelected]}
                                    onPress={() => handleSelectCategory(item)}
                                >
                                    <Text style={[styles.modalItemText, selectedCategory?.id === item.id && styles.modalItemTextSelected]}>
                                        {item.name}
                                    </Text>
                                    {selectedCategory?.id === item.id && (
                                        <AntDesign name="check" size={20} color="#FFF" style={{ marginLeft: 'auto' }} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: THEME.textMain,
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    alertContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
        gap: 8,
    },
    alertText: {
        color: THEME.danger,
        fontWeight: '600',
        fontSize: 14,
    },
    timerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 40,
    },
    adjustmentButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: THEME.secondary, // Yumuşak arka plan
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerContainer: {
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: THEME.white,
        justifyContent: 'center',
        alignItems: 'center',
        // GÖLGELENDİRME
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        // KENARLIK
        borderWidth: 15, // İsteğin üzerine kalınlaştırıldı
        borderColor: THEME.secondary, // Pasifken açık renk
    },
    timerActiveBorder: {
        borderColor: THEME.primary, // Aktifken canlı İndigo
    },
    timerText: {
        fontSize: 56,
        fontWeight: '700',
        color: THEME.textMain,
        letterSpacing: 1,
        fontVariant: ['tabular-nums'], // Sayıların titremesini önler
    },
    statusText: {
        fontSize: 14,
        color: THEME.textSub,
        marginTop: 5,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    // --- KATEGORİ SEÇİCİ ---
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.white,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 20,
        width: '90%',
        marginBottom: 15,
        // Eski border yerine gölge
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    categoryIconBg: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categorySelectorText: {
        fontSize: 16,
        color: THEME.textMain,
        fontWeight: '600',
    },
    // --- BUTONLAR ---
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
        width: '90%',
    },
    button: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 30, // Tam yuvarlak (pill shape)
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    startButton: {
        backgroundColor: THEME.primary,
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    stopButton: {
        backgroundColor: '#F59E0B', // Turuncu
    },
    resetButton: {
        backgroundColor: THEME.secondary,
        flex: 0.5, // Sıfırla butonu daha küçük
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    // --- MODAL ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Arka planı biraz daha kararttık
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        minHeight: '45%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: THEME.textMain,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        backgroundColor: THEME.background,
    },
    modalItemSelected: {
        backgroundColor: THEME.primary,
    },
    modalItemText: {
        fontSize: 16,
        color: THEME.textMain,
        fontWeight: '500',
    },
    modalItemTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});