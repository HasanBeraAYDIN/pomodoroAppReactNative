import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  // Sayaç durumu (State)
  const [timer, setTimer] = useState('25:00');
  const [isActive, setIsActive] = useState(false);

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.headerTitle}>Odaklanma Seansı</Text>

      {/* Sayaç Dairesi ve Metni */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      {/* Kategori Bilgisi (Şimdilik Statik) */}
      <Text style={styles.categoryText}>Kategori: Henüz Seçilmedi</Text>

      {/* Kontrol Butonları */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.startButton]}>
          <Text style={styles.buttonText}>Başlat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]}>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 40,
  },
  timerContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#E63946', // Pomodoro Kırmızısı
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 30,
    elevation: 5, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  categoryText: {
    fontSize: 16,
    color: '#457B9D',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
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