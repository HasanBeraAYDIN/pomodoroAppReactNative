import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, AppState, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { formatTime } from '../../utils/timeFormatter';

const DEFAULT_TIME = 25 * 60;

const CATEGORIES = [
  { id: '1', name: 'Ders Çalışma', icon: 'book' },
  { id: '2', name: 'Kodlama', icon: 'code' },
  { id: '3', name: 'Kitap Okuma', icon: 'book' },
  { id: '4', name: 'Proje', icon: 'book' },
];

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);

  // --- YENİ STATE'LER ---
  const [distractionCount, setDistractionCount] = useState(0); // Dikkat dağınıklığı sayısı 
  const appState = useRef(AppState.currentState); // Uygulamanın anlık durumu
  // ----------------------

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Sayaç Mantığı
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Süre bittiğinde
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 2. AppState (Dikkat Dağınıklığı) Takibi [cite: 21, 22, 23]
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Eğer sayaç aktifse ve uygulama arka plana (inactive/background) düştüyse
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/) &&
        isActive
      ) {
        setIsActive(false); // Sayacı duraklat [cite: 23]
        setDistractionCount(prev => prev + 1); // İhlal sayısını artır
        Alert.alert("Dikkat Dağınıklığı!", "Uygulamadan çıktığınız için sayaç duraklatıldı.");
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  const handleSessionComplete = () => {
    // Seans bittiğinde özet göster 
    Alert.alert(
      "Tebrikler! 🎉",
      `Seans Tamamlandı.\nKategori: ${selectedCategory?.name || 'Genel'}\nOdaklanma Süresi: ${DEFAULT_TIME / 60} dk\nDikkat Dağınıklığı: ${distractionCount} kez`,
      [{ text: "Tamam", onPress: resetTimer }]
    );
    // BURAYA İLERİDE VERİTABANI KAYIT FONKSİYONU GELECEK
  };

  const adjustTime = (minutes) => {
    setTimeLeft(prev => {
      const newTime = prev + minutes * 60;
      return newTime > 0 ? newTime : 0;
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
    setDistractionCount(0); // Sayacı sıfırla
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Odaklanma Seansı</Text>

      {/* --- Dikkat Dağınıklığı Göstergesi (Opsiyonel UI) --- */}
      {distractionCount > 0 && (
        <View style={{ marginBottom: 20, padding: 8, backgroundColor: '#FFEBEB', borderRadius: 8 }}>
          <Text style={{ color: '#E63946', fontWeight: '600' }}>
            Dikkat Dağınıklığı: {distractionCount}
          </Text>
        </View>
      )}

      {/* Timer Alanı */}
      <View style={styles.timerWrapper}>
        <TouchableOpacity style={styles.adjustmentButton} onPress={() => adjustTime(-5)}>
          <AntDesign name="minus" size={24} color="#1D3557" />
        </TouchableOpacity>

        <View style={[styles.timerContainer, isActive && styles.timerActiveBorder]}>
          {/* Timer Text */}
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          {/* Status Text */}
          <Text style={styles.statusText}>{isActive ? 'Odaklanıyor...' : 'Duraklatıldı'}</Text>
        </View>

        <TouchableOpacity style={styles.adjustmentButton} onPress={() => adjustTime(5)}>
          <AntDesign name="plus" size={24} color="#1D3557" />
        </TouchableOpacity>
      </View>

      {/* ... KATEGORİ SEÇİCİ AYNI KALACAK ... */}
      <TouchableOpacity
        style={styles.categorySelector}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="tag" size={20} color="#E63946" />
        <Text style={styles.categorySelectorText}>
          {selectedCategory ? selectedCategory.name : 'Kategori Seç'}
        </Text>
        <AntDesign name="down" size={16} color="#1D3557" style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      {/* ... BUTONLAR AYNI KALACAK ... */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton, isActive ? { backgroundColor: '#E63946' } : {}]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Duraklat' : 'Başlat'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      {/* ... MODAL KODLARI AYNI KALACAK ... */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* ... Modal İçeriği Aynı ... */}
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bir Kategori Seç</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCategory?.id === item.id && styles.modalItemSelected
                  ]}
                  onPress={() => handleSelectCategory(item)}
                >
                  <AntDesign name={item.icon} size={20} color={selectedCategory?.id === item.id ? "#FFF" : "#1D3557"} />
                  <Text style={[
                    styles.modalItemText,
                    selectedCategory?.id === item.id && styles.modalItemTextSelected
                  ]}>
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
  // ... Eski stillerin aynen kalacak ...
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D3557',
    marginBottom: 35,
    letterSpacing: 0.5,
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  adjustmentButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#DEEAF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  timerContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: '#a139e6ff',
  },
  timerActiveBorder: {
    borderColor: '#2A9D8F', // Aktifken renk değişsin
  },
  timerText: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#1D3557',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 16,
    color: '#457B9D',
    marginTop: 5,
    fontWeight: '500'
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1'
  },
  categorySelectorText: {
    fontSize: 16,
    color: '#1D3557',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: '40%',
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFB',
    gap: 12,
  },
  modalItemSelected: {
    backgroundColor: '#1D3557',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1D3557',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 28,
    minWidth: 130,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  startButton: {
    backgroundColor: '#1D3557',
  },
  resetButton: {
    backgroundColor: '#A8DADC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});