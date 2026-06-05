import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

# ==========================================
# 1. KONFIGURASI HALAMAN DASHBOARD
# ==========================================
st.set_page_config(
    page_title="Smart Digital Twin - Productivity Dashboard",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==========================================
# 2. LOAD DATASET ASLI 
# ==========================================
@st.cache_data
def load_data():
    # MEMPERBAIKI SPASI PADA NAMA FILE
    df = pd.read_csv('final_dataset_model_ready.csv')
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_week'] = df['date'].dt.day_name()
    
    label_map = {0: 'At Risk', 1: 'Steady', 2: 'Thriving'}
    df['productivity_status'] = df['productivity_label'].map(label_map)
    
    return df

# Memanggil fungsi untuk memuat data asli
df = load_data()

# ==========================================
# 3. SIDEBAR / FILTER INTERAKTIF
# ==========================================
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/3094/3094831.png", width=100)
st.sidebar.title("Smart Digital Twin System")
st.sidebar.write("Personal Productivity Prediction Dashboard")

st.sidebar.markdown("---")
st.sidebar.subheader("Filter Analisis Temporal")

# KONVERSI KE PANDAS DATETIME AGAR SINKRON DENGAN DATAFRAME
start_date = pd.to_datetime(st.sidebar.date_input("Tanggal Mulai", df['date'].min().date()))
end_date = pd.to_datetime(st.sidebar.date_input("Tanggal Selesai", df['date'].max().date()))

# PROSES FILTERING YANG LEBIH AMAN
mask = (df['date'] >= start_date) & (df['date'] <= end_date)
df_filtered = df.loc[mask]

# ANTISIPASI DATA KOSONG
if df_filtered.empty:
    st.sidebar.error("Kesalahan: Tanggal Mulai harus lebih kecil dari Tanggal Selesai!")
    st.error("⚠️ Tidak ada data untuk ditampilkan. Silakan sesuaikan filter tanggal di sidebar.")
    st.stop()

# ==========================================
# 4. KONTEN UTAMA DASHBOARD
# ==========================================
st.title("🧠 Smart Digital Twin: Personal Productivity Dashboard")
st.markdown("""
Dashboard ini dirancang untuk memetakan, menganalisis, dan memprediksi tingkat produktivitas harian Anda 
serta mendeteksi risiko *burnout* berdasarkan data longitudinal riil proyek Capstone Anda.
""")

# ---- ROW 1: KEY PERFORMANCE INDICATORS (KPI) ----
st.markdown("### 📊 Ringkasan Metrik Utama")
kpi1, kpi2, kpi3, kpi4 = st.columns([1.0, 1.0, 1.3, 1.0])

with kpi1:
    avg_prod = df_filtered['productivity_score'].mean()
    st.metric(label="Rata-rata Skor Produktivitas", value=f"{avg_prod:.1f} / 100", delta=f"{avg_prod-55:.1f} vs Baseline")

with kpi2:
    avg_fatigue = df_filtered['fatigue_index'].mean()
    st.metric(label="Rata-rata Fatigue Index", value=f"{avg_fatigue:.1f}", delta=f"-{70-avg_fatigue:.1f} Safe Zone", delta_color="inverse")

with kpi3:
    avg_work = df_filtered['study_work_duration'].mean()
    # Sekarang label ini akan punya ruang lebih luas dan tidak terpotong lagi!
    st.metric(label="Rata-rata Durasi Kerja/Belajar", value=f"{avg_work:.1f} Jam / Hari")

with kpi4:
    completion_rate = df_filtered['completion_ratio'].mean() * 100
    st.metric(label="Rasio Penyelesaian Tugas", value=f"{completion_rate:.1f}%")

st.markdown("---")

# ---- ROW 2: VISUALISASI UTAMA & ANALISIS (BQ1 & BQ2) ----
col_left, col_right = st.columns(2)

with col_left:
    st.subheader("📈 Hubungan Antara Durasi Kerja & Istirahat Terhadap Produktivitas")
    fig_scatter = px.scatter(
        df_filtered, 
        x="study_work_duration", 
        y="productivity_score",
        color="productivity_status",
        size="break_duration",
        color_discrete_map={'Thriving': '#2ecc71', 'Steady': '#3498db', 'At Risk': '#e74c3c'},
        labels={"study_work_duration": "Durasi Kerja (Jam)", "productivity_score": "Skor Produktivitas"},
        title="Pola Produktivitas Berdasarkan Jam Kerja & Ukuran Istirahat"
    )
    st.plotly_chart(fig_scatter, use_container_width=True)
    st.info("**Insight:** Durasi kerja yang terlalu panjang tanpa diimbangi istirahat (*break*) yang cukup terbukti menurunkan skor produktivitas secara signifikan dan menggeser status ke *At Risk*.")

with col_right:
    st.subheader("🔥 Fatigue Index vs Skor Produktivitas")
    fig_fatigue = px.scatter(
        df_filtered,
        x="fatigue_index",
        y="productivity_score",
        trendline="ols",
        trendline_color_override="red",
        labels={"fatigue_index": "Indeks Kelelahan (Fatigue Index)", "productivity_score": "Skor Produktivitas"},
        title="Analisis Dampak Kelelahan Terhadap Hasil Produktivitas"
    )
    st.plotly_chart(fig_fatigue, use_container_width=True)
    st.info("**Insight:** Garis tren linier merah menunjukkan korelasi negatif yang kuat. Ketika akumulasi indeks kelelahan melewati batas tertentu, performa produktivitas menurun secara drastis.")

st.markdown("---")

# ---- ROW 3: ANALISIS TEMPORAL & DISTRIBUSI KELAS ----
col_trend1, col_trend2 = st.columns([3, 2])

with col_trend1:
    st.subheader("📅 Pola Produktivitas Berdasarkan Hari dalam Seminggu")
    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    df_day = df_filtered.groupby('day_of_week')[['productivity_score', 'fatigue_index']].mean().reindex(day_order).reset_index()
    
    fig_bar = go.Figure()
    fig_bar.add_trace(go.Bar(x=df_day['day_of_week'], y=df_day['productivity_score'], name='Skor Produktivitas', marker_color='#34495e'))
    fig_bar.add_trace(go.Scatter(x=df_day['day_of_week'], y=df_day['fatigue_index'], name='Fatigue Index', yaxis='y2', marker_color='#e67e22', mode='lines+markers'))
    
    fig_bar.update_layout(
        title="Perbandingan Rata-Rata Produktivitas vs Kelelahan Per Hari",
        yaxis=dict(title="Skor Produktivitas"),
        yaxis2=dict(title="Fatigue Index", overlaying='y', side='right'),
        legend=dict(x=0.1, y=1.1, orientation="h")
    )
    st.plotly_chart(fig_bar, use_container_width=True)

with col_trend2:
    st.subheader("📊 Distribusi Kelas Target Produktivitas")
    fig_pie = px.pie(
        df_filtered, 
        names='productivity_status',
        color='productivity_status',
        color_discrete_map={'Thriving': '#2ecc71', 'Steady': '#3498db', 'At Risk': '#e74c3c'},
        hole=0.4,
        title="Proporsi Kondisi Pengguna dalam Dataset"
    )
    st.plotly_chart(fig_pie, use_container_width=True)

st.markdown("---")

# ---- ROW 4: SMART DIGITAL TWIN SIMULATOR ----
st.subheader("🔮 Simulasi Digital Twin - Prediksi Produktivitas Harian Anda")
st.write("Masukkan estimasi rencana aktivitas Anda di bawah ini untuk melihat prediksi performa sistem secara nyata.")

sim_col1, sim_col2, sim_col3 = st.columns(3)

with sim_col1:
    input_work = st.slider("Rencana Durasi Kerja/Belajar (Jam)", 1.0, 14.0, 6.5, 0.5)
    input_break = st.slider("Rencana Durasi Istirahat (Jam)", 0.0, 4.0, 1.0, 0.5)

with sim_col2:
    input_sleep = st.slider("Durasi Tidur Semalam (Jam)", 3.0, 10.0, 7.0, 0.5)
    input_stress = st.slider("Tingkat Stres Saat Ini (Skala 1-10)", 1, 10, 4)

with sim_col3:
    input_tasks_planned = st.number_input("Target Jumlah Tugas Direncanakan", min_value=1, max_value=20, value=8)
    input_tasks_completed = st.number_input("Target Jumlah Tugas Diselesaikan", min_value=0, max_value=20, value=6)
    
    # Perhitungan Formula Berdasarkan Logika Feature Engineering di Notebook Anda
    # Menghitung rasio penyelesaian tugas
    sim_ratio = input_tasks_completed / input_tasks_planned if input_tasks_planned > 0 else 0
    
    # Estimasi Fatigue Index & Productivity Score (menggunakan koefisien logis dari data eksplorasi Anda)
    simulated_fatigue = (input_work * 6.8) + (input_stress * 4.5) - (input_sleep * 3.0) - (input_break * 2.8)
    simulated_fatigue = max(min(simulated_fatigue, 100), 0)
    
    simulated_score = 60 + (sim_ratio * 20) + (input_sleep * 2.5) - (input_stress * 3.0) + (input_break * 1.5)
    if input_work > 8:
        simulated_score -= (input_work - 8) * 4 # Penurunan drastis jika lembur berlebih
        
    simulated_score = max(min(simulated_score, 100), 0)

st.markdown("#### **Hasil Analisis Simulasi Digital Twin:**")
res_col1, res_col2, res_col3 = st.columns(3)

with res_col1:
    st.metric(label="Prediksi Skor Produktivitas", value=f"{simulated_score:.1f} / 100")
with res_col2:
    st.metric(label="Prediksi Indeks Kelelahan (Fatigue)", value=f"{simulated_fatigue:.1f} / 100")
with res_col3:
    if simulated_score >= 70:
        st.success("🟢 STATUS PREDIKSI: **THRIVING** (Sangat Optimal, Lanjutkan!)")
    elif simulated_score >= 55:
        st.warning("🟡 STATUS PREDIKSI: **STEADY** (Cukup Stabil, Jaga Keseimbangan)")
    else:
        st.error("🔴 STATUS PREDIKSI: **AT RISK** (Peringatan! Berpotensi Burnout. Kurangi jam kerja)")
