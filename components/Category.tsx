import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CATEGORIES = [
    { id: '1', name: 'Ders Çalışma' },
    { id: '2', name: 'Kodlama' },
    { id: '3', name: 'Proje' },
    { id: '4', name: 'Kitap Okuma' },
];

// Bileşenin dışarıdan alacağı özellikleri (Props) tanımlayalım
interface CategoryProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export default function Category({ selectedId, onSelect }: CategoryProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Kategori Seçimi</Text>
            <View style={styles.list}>
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedId === cat.id; // Şu anki buton seçili mi?
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => onSelect(cat.id)} // Tıklanınca ID'yi yukarı gönder
                            style={[styles.item, isSelected && styles.selectedItem]} // Seçiliyse stili değiştir
                        >
                            <Text style={[styles.text, isSelected && styles.selectedText]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 10,
        textAlign: 'center',
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    item: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#A8DADC',
    },
    selectedItem: {
        backgroundColor: '#1D3557', // Seçilince koyu mavi olsun
        borderColor: '#1D3557',
    },
    text: {
        color: '#1D3557',
        fontWeight: '600',
        fontSize: 14,
    },
    selectedText: {
        color: '#fff', // Seçilince yazı beyaz olsun
    },
});