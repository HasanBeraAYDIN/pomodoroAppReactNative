import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Az önce yaptığımız bileşeni içeri alıyoruz
import Category from '../../components/Category';

export default function HomeScreen() {
  const [timer, setTimer] = useState('25:00');
  // Seçilen kategoriyi tutacak State (Başlangıçta boş)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Odaklanma Seansı</Text>

      {/* Sayaç */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      {/* --- YENİ EKLENEN KISIM --- */}
      {/* Category bileşenini buraya koyduk ve state'i bağladık */}
      <Category
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />
      {/* ------------------------- */}

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
    paddingBottom: 40, // Aşağıda biraz boşluk kalsın
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
    marginTop: 40, // Butonları biraz aşağı ittik
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