

export default function BioData() {
    const userDateStr = new Date().toLocaleDateString();

    return (
        <div className="container">
            
            <div className="header">
                <h1>Biodata Pribadi</h1>
                <p>Selamat Belajar ReactJs 🚀</p>
            </div>

            <UserCard 
                nama="Muhammad Syabil Al Jabbar"
                nim="2457301098"
                prodi="D4 Sistem Informasi"
                tanggal={userDateStr}
                alamat="Kota Pekanbaru, Riau"
                email="syabil24si@mahasiswa.pcr.ac.id"
            />
            
            <QuoteText />
            <GreetingBinjai />
        </div>
    );
}

/* ================= USER CARD ================= */
function UserCard(props){
    return (
        <div className="card">

            <div className="profile">
                <img src="img/Picture1.png" alt="profile" />
            </div>

          <div className="info">

  <div className="info-item">
    <div className="info-label">👤 Nama</div>
    <div className="info-value">{props.nama}</div>
  </div>

  <div className="info-item">
    <div className="info-label">🎓 Prodi</div>
    <div className="info-value">{props.prodi}</div>
  </div>

  <div className="info-item">
    <div className="info-label">🆔 NIM</div>
    <div className="info-value">{props.nim}</div>
  </div>

  <div className="info-item">
    <div className="info-label">📅 Tanggal</div>
    <div className="info-value">{props.tanggal}</div>
  </div>

  <div className="info-item">
    <div className="info-label">📍 Alamat</div>
    <div className="info-value">{props.alamat}</div>
  </div>

  <div className="info-item">
    <div className="info-label">✉️ Email</div>
    <div className="info-value">{props.email}</div>
  </div>

</div>

        </div>
    )
}

/* ================= QUOTE ================= */
function QuoteText() {
    return (
        <div className="quote">
            <div className="quote-box">
               
                <p>Pulang lah membawa Mahkota</p>
                <h3>Jangan pulang membawa derita</h3>
            </div>
        </div>
    )
}

/* ================= FOOTER ================= */
function GreetingBinjai() {
    return (
        <div className="footer">
            <p>Made with by Syabil</p>
        </div>
    )
}