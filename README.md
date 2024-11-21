Berikut adalah **README.md** dalam bahasa Indonesia dengan penjelasan yang mudah dimengerti:

---

# **Prediksi Churn Pelanggan menggunakan Node.js dan TensorFlow.js**

Proyek ini menggunakan **Node.js** dan **TensorFlow.js** untuk membangun model machine learning yang dapat memprediksi apakah seorang pelanggan akan berhenti menggunakan layanan (churn) atau tetap melanjutkan (tidak churn).

---

## **Fitur**
- Membaca data pelanggan dari file CSV.
- Melatih model machine learning untuk prediksi churn.
- Mengevaluasi akurasi model menggunakan data uji.
- Memprediksi churn berdasarkan data pelanggan baru yang dimasukkan melalui terminal.

---

## **Cara Menggunakan**

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda.

### **1. Persyaratan**
- **Node.js** harus terinstal di komputer Anda.
- Editor teks seperti **Visual Studio Code** atau terminal untuk menjalankan aplikasi.

### **2. Instalasi**

1. **Unduh atau Clone Repository**  
   Jika menggunakan Git:
   ```bash
   git clone https://github.com/your-repo/customer-churn-prediction.git
   cd customer-churn-prediction
   ```

2. **Pasang Dependensi**  
   Jalankan perintah berikut untuk menginstal semua library yang diperlukan:
   ```bash
   npm install @tensorflow/tfjs csv-parser
   ```

3. **Buat Dataset**  
   Buat file bernama `customer_churn.csv` di dalam folder proyek, lalu isi dengan data berikut:

   ```csv
   customerID,tenure,monthlyCharges,totalCharges,contract,churn
   1,12,70.35,840.50,0,1
   2,24,55.50,1332.00,1,0
   3,5,99.00,495.00,0,1
   4,36,25.30,910.80,2,0
   5,2,95.50,191.00,0,1
   6,48,19.85,952.80,2,0
   ...
   ```

   **Penjelasan Kolom Dataset**:
   - **tenure**: Lama waktu pelanggan berlangganan (dalam bulan).
   - **monthlyCharges**: Biaya langganan bulanan.
   - **totalCharges**: Total biaya yang telah dibayarkan.
   - **contract**: Jenis kontrak (0: Bulanan, 1: Satu Tahun, 2: Dua Tahun).
   - **churn**: Status churn (1: Churn, 0: Tidak Churn).

---

### **3. Menjalankan Program**

1. Jalankan perintah berikut:
   ```bash
   node index.js
   ```

2. Program akan memuat dataset, melatih model, dan meminta Anda untuk memasukkan data pelanggan baru.

3. **Masukkan Data Pelanggan Baru**  
   Masukkan data dalam format berikut (pisahkan dengan koma):
   ```
   tenure, monthlyCharges, totalCharges, contract
   ```
   Contoh:
   ```
   Masukkan data pelanggan (tenure, monthlyCharges, totalCharges, contract) dipisahkan dengan koma: 24, 75.50, 1812.00, 1
   ```

4. Program akan menampilkan prediksi seperti ini:
   ```
   Churn Probability: 35.75%
   Prediction: Tidak Churn (Memperpanjang)
   ```

---

## **Penjelasan Kode**

1. **Membaca Dataset**
   ```javascript
   const loadDataset = async (filePath) => { ... };
   ```
   Fungsi ini membaca file CSV (`customer_churn.csv`) dan mengonversinya menjadi data yang dapat digunakan untuk pelatihan model.

2. **Membagi Data**
   ```javascript
   const trainTestSplit = (data, testRatio) => { ... };
   ```
   Membagi dataset menjadi:
   - **Training set** (80%) untuk melatih model.
   - **Test set** (20%) untuk mengevaluasi model.

3. **Mempersiapkan Data TensorFlow**
   ```javascript
   const prepareData = (data) => { ... };
   ```
   Mengubah data menjadi bentuk tensor yang dapat digunakan TensorFlow:
   - **Input**: `[tenure, monthlyCharges, totalCharges, contract]`.
   - **Label**: `[churn]`.

4. **Membuat Model**
   ```javascript
   const buildModel = () => { ... };
   ```
   - Membuat model neural network dengan 2 hidden layer:
     - Layer pertama: 16 neuron.
     - Layer kedua: 8 neuron.
   - Layer output menggunakan fungsi aktivasi `sigmoid` untuk prediksi biner (churn atau tidak churn).

5. **Melatih Model**
   ```javascript
   await model.fit(trainX, trainY, { epochs: 20, batchSize: 16, validationSplit: 0.2 });
   ```
   Model dilatih selama **20 epoch**, dengan ukuran batch **16**.

6. **Prediksi**
   ```javascript
   const predictChurn = async (model, newCustomer) => { ... };
   ```
   Menghitung kemungkinan churn berdasarkan data pelanggan baru.

7. **Input dari Terminal**
   ```javascript
   const getCustomerInput = () => { ... };
   ```
   Membaca input pelanggan dari terminal.

---

## **Hasil Program**

### **Contoh Input**
```
Masukkan data pelanggan (tenure, monthlyCharges, totalCharges, contract) dipisahkan dengan koma: 24, 75.50, 1812.00, 1
```

### **Contoh Output**
```
Churn Probability: 35.75%
Prediction: Tidak Churn (Memperpanjang)
```

---

## **Pengembangan Lebih Lanjut**
- Tambahkan lebih banyak data untuk meningkatkan akurasi model.
- Simpan hasil prediksi ke file atau database.
- Kembangkan menjadi API untuk digunakan dalam aplikasi web.

---