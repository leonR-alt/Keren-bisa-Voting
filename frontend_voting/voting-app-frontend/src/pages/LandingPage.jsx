import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
const LandingPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="grid-lines" />
        </div>

        <div className="hero-content container">
          <div className="hero-left">
            <span className="hero-tag animate-fadeUp">🗳️ Platform E-Voting Modern</span>
            <h1 className="hero-title animate-fadeUp delay-1">
              Suara Anda,<br />
              <span className="gradient-text">Masa Depan</span><br />
              Kita Bersama
            </h1>
            <p className="hero-desc animate-fadeUp delay-2">
              Platform pemungutan suara digital yang aman, transparan, dan mudah digunakan.
              Dirancang untuk memastikan setiap suara terhitung dengan akurat.
            </p>
            <div className="hero-pills animate-fadeUp delay-3">
              <span className="pill">🔒 Aman</span>
              <span className="pill">⚡ Transparan</span>
              <span className="pill">🚀 Cepat</span>
            </div>
            <div className="hero-cta animate-fadeUp delay-4">
              <Link to="/register" className="btn btn-primary btn-lg">
                Mulai Voting
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Masuk
              </Link>
            </div>
          </div>

          <div className="hero-right animate-fadeUp delay-2">
            <div className="hero-card-stack">
              <div className="floating-card card-main">
                <div className="card-header">
                  <div className="card-avatar">🗳️</div>
                  <div>
                    <div className="card-title">Pemilihan Aktif</div>
                    <div className="card-sub">Berakhir dalam 2 hari</div>
                  </div>
                </div>
                <div className="card-candidates">
                  {["Prabowo Mondardo", "Abah Anies", "Ganjar Sudah Dewasa"].map((name, i) => (
                    <div className="candidate-row" key={i}>
                      <div className="candidate-avatar">{name[0]}</div>
                      <div className="candidate-info">
                        <span>{name}</span>
                        <div className="vote-bar">
                          <div className="vote-fill" style={{ width: `${[65, 45, 30][i]}%` }} />
                        </div>
                      </div>
                      <span className="vote-pct">{[65, 45, 30][i]}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="floating-card card-stats">
                <div className="stat-row">
                  <span className="stat-icon">👥</span>
                  <div>
                    <div className="stat-num">999+</div>
                    <div className="stat-lbl">Total Pemilih</div>
                  </div>
                </div>
              </div>
              <div className="floating-card card-secure">
                <span>🔐</span>
                <span>Terenkripsi & Aman</span>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="section-header reveal">
          <span className="section-tag">Kenapa Kami?</span>
          <h2 className="section-title">Dirancang untuk <span className="gradient-text">Kepercayaan</span></h2>
          <p className="section-desc">Sistem kami menggunakan teknologi terdepan untuk memastikan setiap suara aman dan terhitung.</p>
        </div>

        <div className="features-grid">
          {[
            { icon: "🔐", title: "Keamanan Tinggi", desc: "Enkripsi JWT dan hashing password memastikan data Anda selalu terlindungi dari ancaman." },
            { icon: "⚡", title: "Real-time Results", desc: "Lihat hasil voting secara langsung dengan visualisasi grafik yang mudah dipahami." },
            { icon: "📱", title: "Responsif", desc: "Dapat diakses dari perangkat apapun — desktop, tablet, maupun smartphone." },
            { icon: "🌐", title: "Transparan", desc: "Setiap suara tercatat dan dapat diverifikasi oleh admin untuk memastikan integritas." },
            { icon: "🚫", title: "Anti Double Vote", desc: "Sistem cerdas mencegah pemilih memberikan suara lebih dari satu kali." },
            { icon: "👤", title: "Role Based", desc: "Kontrol akses berbasis peran memisahkan hak admin dan pemilih dengan jelas." },
          ].map((f, i) => (
            <div className={`feature-card card reveal delay-${i % 3 + 1}`} key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Cara Kerja</span>
            <h2 className="section-title">Mudah dalam <span className="gradient-text">3 Langkah</span></h2>
          </div>
          <div className="steps-grid">
            {[
              { num: "01", icon: "📝", title: "Daftar & Verifikasi", desc: "Buat akun dengan email dan password. Akun Anda akan diverifikasi oleh admin." },
              { num: "02", icon: "🗳️", title: "Pilih Kandidat", desc: "Lihat profil dan visi misi kandidat, lalu berikan suara Anda dengan yakin." },
              { num: "03", icon: "📊", title: "Lihat Hasil", desc: "Pantau hasil voting secara real-time dalam bentuk grafik yang informatif." },
            ].map((s, i) => (
              <div className={`step-card reveal delay-${i + 1}`} key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container reveal">
        <div className="cta-card">
          <div className="cta-orb" />
          <span className="section-tag">Siap Berpartisipasi?</span>
          <h2>Bergabung Sekarang dan <span className="gradient-text">Suarakan Pilihan Anda</span></h2>
          <p>Ribuan pemilih telah mempercayai platform kami. Giliran Anda!</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Daftar Gratis
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sudah punya akun? Masuk</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">🗳️ VoteKu</span>
              <p>Platform e-voting modern yang aman, transparan, dan dapat dipercaya.</p>
            </div>
            <div className="footer-links">
              <h4>Navigasi</h4>
              <Link to="/login">Masuk</Link>
              <Link to="/register">Daftar</Link>
            </div>
            <div className="footer-links">
              <h4>Sistem</h4>
              <span>Secure • Transparent • Fast</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 VoteKu. Dibuat sendiridengan ❤️ untuk demokrasi digital.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;