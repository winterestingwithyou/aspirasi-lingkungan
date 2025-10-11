import { useRef, useState } from 'react';
import { Badge, Card, Col, Container, Image, Row } from 'react-bootstrap';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

// Data Teknologi yang digunakan
const teknologi = [
  {
    logo: './react.png',
    name: 'React',
    description:
      'Library JavaScript yang digunakan untuk membangun antarmuka pengguna (UI) melalui pembentukan komponen yang dapat digunakan kembali.',
  },
  {
    logo: './react-router-v7.png',
    name: 'React Router V7',
    description:
      'Mengelola navigasi di sisi klien, memfasilitasi pembuatan Single Page Application (SPA) tanpa perlu reload halaman.',
  },
  {
    logo: './bootstrap.png',
    name: 'Bootstrap',
    description:
      'Framework CSS yang menyediakan style siap pakai dan sistem grid responsif, yang berfungsi untuk menstandarisasi dan mempercepat proses desain visual aplikasi.',
  },
  {
    logo: './react-bootstrap.png',
    name: 'React-Bootstrap',
    description:
      'Integrasi yang menyediakan komponen-komponen Bootstrap sebagai komponen React, yang menyederhanakan proses styling dan mempercepat pengembangan UI.',
  },
  {
    logo: './prisma.png',
    name: 'Prisma',
    description:
      'Object-Relational Mapper (ORM) yang digunakan sebagai lapisan abstraksi antara aplikasi dan database. Berperan untuk mempermudah interaksi dengan data melalui kode yang intuitif, tanpa memerlukan penulisan query SQL secara langsung.',
  },
  {
    logo: './postgresql.png',
    name: 'PostgreSQL',
    description:
      'Sistem manajemen database relasional yang berfungsi sebagai repositori data utama, yang dikenal karena keandalan dan kekuatan dalam mengelola data terstruktur.',
  },
  {
    logo: './neondb.png',
    name: 'NeonDB',
    description:
      'Layanan database serverless berbasis PostgreSQL, digunakan untuk menyediakan infrastruktur database yang dapat diskalakan secara otomatis dan hemat biaya.',
  },
  {
    logo: './cloudflare.png',
    name: 'Cloudflare',
    description:
      'Platform untuk mendistribusikan aset web melalui Content Delivery Network (CDN) global, yang secara signifikan mengurangi latensi dan mempercepat waktu muat aplikasi.',
  },
  {
    logo: './cloudinary.png',
    name: 'Cloudinary',
    description:
      'Platform manajemen media cloud. Berfungsi untuk mengurangi beban server dan memastikan pengiriman konten media yang cepat dan efisien.',
  },
];

// Data Developer
const developers = [
  {
    photo: '/Rafly.jpg', // Pastikan file Rafly.jpg ada di folder /public
    name: 'Rafly Alamsyach',
    nim: '09010282327055',
    prodi: 'Manajemen Informatika',
    univ: 'Universitas Sriwijaya',
    role: 'Front-End Developer',
    description: 'Optimis itu harus, tapi jangan lupa untuk menyediakan ruang ikhlas',
  },
  {
    photo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC532ntuioceluApWgmdzoWp-PJllVki0jUA&s',
    name: 'M. Adam Yudistira',
    nim: '09010182327064',
    prodi: 'Manajemen Informatika',
    univ: 'Universitas Sriwijaya',
    role: 'Back-End Developer',
    description: 'Kata-kata hari ini',
  },
];

export default function TentangKamiPage() {
  const carouselRef = useRef<AliceCarousel>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="page-section">
      <Container>
        {/* Bagian 1: Tentang Aplikasi */}
        <Row className="align-items-center justify-content-center g-5 pt-4 pt-lg-0">
          <Col md={6} lg={4} className="text-center">
            <Image
              src="./eco-rapid.png" // logo aplikasi
              alt="ECO-RAPID Logo"
              className="about-us-logo"
              style={{ width: '350px', height: 'auto' }}
            />
          </Col>
          <Col md={10} lg={8}>
            <h2 className="section-title">Tentang ECO-RAPID</h2>
            <p className="lead">
              ECO-RAPID adalah platform inovatif yang dirancang untuk
              menjembatani komunikasi antara masyarakat dan pemerintah dalam
              menangani masalah lingkungan.
            </p>
            <p>
              Kami percaya bahwa partisipasi aktif dari masyarakat adalah kunci
              untuk menciptakan lingkungan yang lebih bersih, aman, dan sehat.
              Dengan ECO-RAPID, melaporkan masalah seperti tumpukan sampah,
              saluran air tersumbat, atau penebangan liar menjadi lebih mudah
              dan transparan. Setiap laporan dapat dipantau status penanganannya
              secara real-time, memastikan akuntabilitas dan penyelesaian yang
              cepat.
            </p>
          </Col>
        </Row>

        {/* Bagian 2: Carousel Teknologi */}
        <div className="text-center mb-5 mt-5">
          <h2 className="section-title">Teknologi di Balik ECO-RAPID</h2>
          <p className="lead">
            Kami menggunakan teknologi modern untuk memberikan performa dan
            keandalan terbaik.
          </p>
        </div>

        <div className="tech-carousel-container">
          <button
            className="tech-carousel-nav-btn tech-carousel-prev-btn"
            onClick={() => carouselRef.current?.slidePrev()}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <AliceCarousel
            ref={carouselRef}
            mouseTracking
            infinite
            disableDotsControls
            disableButtonsControls // Menonaktifkan tombol bawaan
            onSlideChanged={(e) => setActiveIndex(e.item)}
            items={teknologi.map((tech, index) => {
              const centerIndex = (activeIndex + 1) % teknologi.length;
              const isCenter = index === centerIndex;
              const itemClass = isCenter ? 'center' : 'side';

              return (
                <div key={index} className={`tech-carousel-item ${itemClass} text-center p-4`}>
                  <img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    style={{
                      height: '80px',
                      objectFit: 'contain',
                      marginBottom: '1rem',
                    }}
                  />
                  <h5>{tech.name}</h5>
                  <p className="small">{tech.description}</p>
                </div>
              );
            })}
            responsive={{
              0: { items: 1, itemsFit: 'contain' },
              992: { items: 3, itemsFit: 'contain' },
            }}
          />
          <button
            className="tech-carousel-nav-btn tech-carousel-next-btn"
            onClick={() => carouselRef.current?.slideNext()}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Bagian 3: Tim Pengembang */}
      <div className="text-center mb-5 mt-5">
        <h2 className="section-title">Tim Pengembang</h2>
        <p className="lead">
          Orang-orang di balik pengembangan aplikasi ini.
        </p>
      </div>
      <Row className="justify-content-center g-4">
        {developers.map((dev, index) => (
          <Col md={8} lg={6} key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                  <Image
                    src={dev.photo}
                    roundedCircle
                    style={{ width: '170px', height: '170px', objectFit: 'cover' }}
                    className="mb-3 mb-md-0 me-md-4 flex-shrink-0"
                  />
                  <div>
                    <h5 className="mb-1">{dev.name}</h5>
                    <p className="text-muted small mb-1">{dev.nim}</p>
                    <p className="text-muted small mb-2">{`${dev.prodi}, ${dev.univ}`}</p>
                    <Badge bg="primary">{dev.role}</Badge>
                  </div>
                </div>
                <p className="mt-3 mb-0 fst-italic text-center text-md-start">"{dev.description}"</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      </Container>
    </section>
  );
}
