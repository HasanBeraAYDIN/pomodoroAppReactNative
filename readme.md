# 🎯 Odaklanma ( pomodoroApp) - Modern Pomodoro Timer

**Odaklanma**, kullanıcıların verimliliğini artırmak için Pomodoro tekniğini kullanan, modern arayüze sahip bir mobil uygulamadır. Kullanıcıların çalışma seanslarını kaydeder, dikkat dağınıklıklarını takip eder ve detaylı grafiklerle performans analizi sunar.

## Özellikler

*** Özelleştirilebilir Sayaç:** Standart 25 dakikalık Pomodoro sayacı. Süre ekleme/çıkarma butonları ile dinamik kontrol.
*** Kategori Yönetimi:** Yapılan işe özel kategori seçimi (Ders Çalışma, Kodlama, Kitap Okuma vb.).
*** Dikkat Dağınıklığı Takibi (Distraction Tracking):** `AppState` API kullanılarak uygulama arka plana atıldığında veya başka uygulamaya geçildiğinde dikkat dağınıklığı sayacının artması ve kullanıcının uyarılması.
*** Yerel Veritabanı:** `expo-sqlite` kullanılarak tüm oturum verilerinin cihazda güvenli ve kalıcı olarak saklanması.
*** Gelişmiş Raporlama:**
    * **Günlük Özet:** Toplam süre ve odaklanma sayıları.
    * **Haftalık Performans:** Son 7 günün verilerini içeren çubuk grafik (Bar Chart).
    * **Kategori Dağılımı:** Çalışma alanlarına göre pasta grafik (Pie Chart).
* ** Modern UI/UX:** "Indigo Flat" renk paleti ile göz yormayan, minimalist tasarım.

##  Kullanılan Teknolojiler

Bu proje aşağıdaki kütüphaneler ve teknolojiler kullanılarak geliştirilmiştir:

* **Core:** React Native, Expo Framework
* **Depolama:** `expo-sqlite` (Veritabanı işlemleri)
* **Grafikler:** `react-native-chart-kit`
* **İkonlar:** `@expo/vector-icons` (AntDesign)
* **Navigasyon:** React Navigation

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone [https://github.com/kullaniciadi/proje-adi.git](https://github.com/kullaniciadi/proje-adi.git)
    cd proje-adi
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    # veya
    yarn install
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npx expo start
    ```

4.  **Çalıştırın:**
    * QR kodu telefonunuzdaki **Expo Go** uygulaması ile taratın.
    * Veya "a" tuşuna basarak **Android Emulator** üzerinde çalıştırın.

## Proje Yapısı

```text
src/
├── data/
│   └── database.js    # SQLite bağlantısı, tablo oluşturma ve CRUD işlemleri
├── screens/
│   ├── index.js       # Ana sayaç ekranı, mantık ve UI
│   └── reports.js     # İstatistik ve grafik ekranı
└── App.js             # Navigasyon ve kök bileşen