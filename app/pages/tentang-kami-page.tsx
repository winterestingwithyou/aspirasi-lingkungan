import { useRef, useState } from 'react';
import { Card, Col, Container, Row, Image } from 'react-bootstrap';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

// Data Teknologi yang digunakan
const teknologi = [
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap A',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap B',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap C',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap D',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap E',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap F',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap G',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap H',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
  {
    logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
    name: 'React Bootstrap I',
    description:
      'Mempercepat pengembangan dengan menyediakan komponen antarmuka yang siap pakai, konsisten, dan sepenuhnya responsif di berbagai perangkat.',
  },
];

// Data Developer
const developers = [
  {
    photo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC532ntuioceluApWgmdzoWp-PJllVki0jUA&s',
    name: 'Rafly Alamsyach',
    id: '09010282327055',
    role: 'Front-End Developer',
    description: 'Kata-kata hari ini',
  },
  {
    photo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC532ntuioceluApWgmdzoWp-PJllVki0jUA&s',
    name: 'M. Adam Yudhistira',
    id: '09010182327064',
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
        <Row className="align-items-center mb-5 mt-3">
          <Col md={4} className="text-center mb-4 mb-md-0">
            <Image
              src="" // logo aplikasi
              alt="ECO-RAPID Logo"
              fluid
              style={{ maxHeight: '250px' }}
            />
          </Col>
          <Col md={8}>
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
        <div className="text-center mb-5 mt-5 pt-4">
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
              // Tentukan apakah item ini adalah item tengah
              // Menggunakan modulus (%) untuk menangani perputaran (looping)
              const centerIndex = (activeIndex + 1) % teknologi.length;
              const isCenter = index === centerIndex;
              const itemClass = isCenter
                ? 'tech-carousel-item center'
                : 'tech-carousel-item side';

              return (
                <div key={index} className={`${itemClass} text-center p-4`}>
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
              576: { items: 2, itemsFit: 'contain' },
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
        <div className="text-center mb-5 mt-5 pt-4">
          <h2 className="section-title">Tim Pengembang</h2>
          <p className="lead">
            Orang-orang di balik pengembangan aplikasi ini.
          </p>
        </div>
        <Row className="justify-content-center g-4">
          {developers.map((dev, index) => (
            <Col md={6} lg={5} key={index}>
              <Card className="h-100">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={4} md={3} className="text-center">
                      <Image src={dev.photo} roundedCircle fluid />
                    </Col>
                    <Col xs={8} md={9}>
                      <h5 className="mb-1">{dev.name}</h5>
                      <p className="text-muted small mb-1">{dev.id}</p>
                      <p className="fw-semibold mb-2">{dev.role}</p>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 small">{dev.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
