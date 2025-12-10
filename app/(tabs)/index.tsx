import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Category from '../../components/Category';
import { formatTime } from '../../utils/timeFormatter';

const FOCUS_TIME = 25 * 60; // 25 Dakika

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 1. MANTIK: Sadece "isActive" durumuna göre sayacı Başlat veya Durdur
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      let interval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    // isActive false olduğunda veya bileşen kapandığında sayacı temizle (Duraklatma işi burada)
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]); // BURASI ÖNEMLİ: Artık timeLeft'e bağlı değil!

  // 2. MANTIK: Süre bitti mi kontrolü
  useEffect(() => {
    if (timeLeft === 0) {
      setIsActive(false);
      // İleride buraya ses çalma veya bildirim gönderme eklenecek
    }
  }, [timeLeft]);

  // Fonksiyonlar
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(FOCUS_TIME);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Odaklanma Seansı</Text>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <Category
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FAEE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 30,
    marginTop: 40,
  },
  timerContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#E63946',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#1D3557',
  },
  resetButton: {
    backgroundColor: '#A8DADC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});