import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { formatTime } from '../../utils/timeFormatter';


const DEFAULT_TIME = 25 * 60;

// Örnek kategoriler (İleride veritabanından gelebilir)
const CATEGORIES = [
  { id: '1', name: 'Ders Çalışma', icon: 'book' },
  { id: '2', name: 'Kodlama', icon: 'code' },
  { id: '3', name: 'Kitap Okuma', icon: 'book' },
  { id: '4', name: 'Spor', icon: 'frowno' },
];


export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);

  // Kategori State'leri
  const [selectedCategory, setSelectedCategory] = useState(null); // Sadece ID değil, tüm objeyi tutabiliriz veya sadece ismi
  const [modalVisible, setModalVisible] = useState(false);
  /**/
  const handleSessionComplete = () => {
    Alert.alert(
      "Seans Tamamlandı! 🎉",
      `Tebrikler!\n\nKategori: ${selectedCategory ? selectedCategory.name : 'Genel'}\nSüre: 25 dk`,
      [
        { text: "Tamam", onPress: () => resetTimer() }
      ]
    );
  };

  useEffect(() => {
    if (!isActive) return;

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setIsActive(false);
          /**/
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isActive]);

  const adjustTime = (minutes) => {
    setTimeLeft(prev => {
      const newTime = prev + minutes * 60;
      return newTime > 0 ? newTime : 0;
    });
  };

  const toggleTimer = () => setIsActive(prev => !prev);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setModalVisible(false); // Seçim yapınca modalı kapat
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Odaklanma Seansı</Text>

      {/* Timer Alanı */}
      <View style={styles.timerWrapper}>
        <TouchableOpacity style={styles.adjustmentButton} onPress={() => adjustTime(-5)}>
          <AntDesign name="minus" size={24} color="#1D3557" />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity style={styles.adjustmentButton} onPress={() => adjustTime(5)}>
          <AntDesign name="plus" size={24} color="#1D3557" />
        </TouchableOpacity>
      </View>

      {/* --- YENİ KATEGORİ SEÇİM ALANI --- */}
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

      {/* --- KONTROL BUTONLARI --- */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
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

      {/* --- MODAL (POP-UP) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
    marginBottom: 30, // Biraz boşluk arttırıldı
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
    borderColor: '#E63946',
  },
  timerText: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#1D3557',
    letterSpacing: 1,
  },

  /* --- YENİ EKLENEN STYLES --- */
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

  /* --- MODAL STYLES --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // Alttan açılması için
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