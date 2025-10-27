import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Fungsi untuk hash password
const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

/**
 * Fungsi ini mereset sequence auto-increment untuk semua tabel.
 * Ini sangat berguna di lingkungan pengembangan untuk memperbaiki error "Unique constraint failed"
 * yang terjadi ketika sequence tidak sinkron setelah operasi manual pada database.
 */
async function resetAllSequences() {
  console.log('🔄 Mereset semua sequence ID...');
  const tableNames = ['users', 'problem_types', 'reports', 'report_progress'];
  for (const tableName of tableNames) {
    const sequenceName = `${tableName}_id_seq`;
    await prisma.$executeRawUnsafe(
      `SELECT setval('${sequenceName}', COALESCE((SELECT MAX(id) FROM "${tableName}"), 1), false);`,
    );
  }
  console.log('✅ Semua sequence berhasil direset.');
}

async function main() {
  console.log('🌱 Memulai proses seeding...');
  await resetAllSequences();

  // 1. Membuat Kategori Masalah (Problem Types)
  console.log('Membuat kategori masalah...');
  const problemType1 = await prisma.problemType.create({
    data: {
      name: 'Tumpukan Sampah Liar',
      description:
        'Laporan terkait tumpukan sampah di lokasi yang tidak semestinya.',
    },
  });

  const problemType2 = await prisma.problemType.create({
    data: {
      name: 'Saluran Air Tersumbat',
      description:
        'Laporan terkait drainase atau selokan yang mampet dan berpotensi menyebabkan banjir.',
    },
  });

  // 2. Membuat Pengguna Dinas (Users)
  console.log('Membuat akun pengguna dinas...');
  const user1 = await prisma.user.create({
    data: {
      username: 'dinaslh',
      email: 'dlhk@palembang.go.id',
      password: await hashPassword('password123'),
      name: 'Budi Santoso',
      departmentName: 'Dinas Lingkungan Hidup dan Kebersihan',
      profilePictureUrl: 'https://i.pravatar.cc/150?u=dlhk',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'dinaspu',
      email: 'pupr@palembang.go.id',
      password: await hashPassword('password123'),
      name: 'Siti Aminah',
      departmentName: 'Dinas Pekerjaan Umum dan Penataan Ruang',
      profilePictureUrl: 'https://i.pravatar.cc/150?u=pupr',
    },
  });

  // 3. Membuat Laporan Masalah (Reports)
  console.log('Membuat laporan masalah dari masyarakat...');

  // Laporan 1: Selesai ditangani
  const report1 = await prisma.report.create({
    data: {
      reporterName: 'Ahmad Zulkifli',
      reporterContact: '081234567890',
      description:
        'Ada tumpukan sampah besar di dekat Pasar 16 Ilir, sudah seminggu lebih dan baunya sangat mengganggu.',
      photoUrl:
        'https://plus.unsplash.com/premium_photo-1673963499424-245f7271e16c?q=80&w=1770',
      latitude: -2.9829, // Koordinat di sekitar Palembang
      longitude: 104.7594,
      status: 'COMPLETED',
      upvoteCount: 25,
      resolvedAt: new Date(),
      problemTypeId: problemType1.id,
    },
  });

  // Laporan 2: Sedang dalam proses
  const report2 = await prisma.report.create({
    data: {
      reporterName: 'Rina Marlina',
      description:
        'Selokan di depan lorong kami di Sekip Ujung tersumbat total, air meluap ke jalan kalau hujan.',
      photoUrl:
        'https://images.unsplash.com/photo-1621232851733-3a5b5e40a6b7?q=80&w=1932',
      latitude: -2.9601,
      longitude: 104.7562,
      status: 'IN_PROGRESS',
      upvoteCount: 12,
      problemTypeId: problemType2.id,
    },
  });

  // Laporan 3: Menunggu tindakan
  await prisma.report.create({
    data: {
      reporterName: 'Warga Anonim',
      description:
        'Sampah rumah tangga dibuang sembarangan di lahan kosong Jl. Demang Lebar Daun.',
      photoUrl:
        'https://images.unsplash.com/photo-1599380333215-7b5c8f1f7e34?q=80&w=1770',
      latitude: -2.9734,
      longitude: 104.7226,
      status: 'PENDING',
      upvoteCount: 5,
      problemTypeId: problemType1.id,
    },
  });

  // Laporan 4: Laporan Palsu
  await prisma.report.create({
    data: {
      reporterName: 'Iseng Aja',
      description: 'Ini cuma laporan tes, tidak ada masalah nyata.',
      photoUrl:
        'https://images.unsplash.com/photo-1560707323-74548e3a25a3?q=80&w=1852',
      latitude: -2.9909,
      longitude: 104.7571,
      status: 'FAKE_REPORT',
      isFakeReport: true,
      upvoteCount: 0,
      problemTypeId: problemType1.id,
    },
  });

  // Laporan 5: Menunggu tindakan lainnya
  await prisma.report.create({
    data: {
      reporterName: 'Sari Puspita',
      reporterContact: 'sari@gmail.com',
      description:
        'Got di depan ruko PTC Mall mampet parah, banyak sampah plastik.',
      photoUrl:
        'https://images.unsplash.com/photo-1582482314342-37b9d784c4a6?q=80&w=1770',
      latitude: -2.9469,
      longitude: 104.7719,
      status: 'PENDING',
      upvoteCount: 8,
      problemTypeId: problemType2.id,
    },
  });

  // 4. Membuat Progress Laporan (Report Progress)
  console.log('Membuat progress untuk laporan yang ditangani...');
  // Progress untuk Laporan 1 (yang sudah Selesai)
  await prisma.reportProgress.create({
    data: {
      reportId: report1.id,
      userId: user1.id,
      status: 'Verifikasi Lapangan',
      description:
        'Tim telah meninjau lokasi dan mengkonfirmasi adanya tumpukan sampah.',
    },
  });
  await prisma.reportProgress.create({
    data: {
      reportId: report1.id,
      userId: user1.id,
      status: 'Pembersihan Selesai',
      description:
        'Sampah telah diangkut seluruhnya oleh petugas kebersihan. Lokasi sudah bersih.',
      progressPhotoUrl:
        'https://images.unsplash.com/photo-1611284446314-60a58ac0707a?q=80&w=1770',
    },
  });

  // Progress untuk Laporan 2 (yang Dalam Proses)
  await prisma.reportProgress.create({
    data: {
      reportId: report2.id,
      userId: user2.id,
      status: 'Penanganan Dimulai',
      description:
        'Petugas dari dinas PU sudah berada di lokasi untuk memulai pembersihan saluran air.',
    },
  });

  console.log('✅ Proses seeding selesai.');
}

// Menjalankan fungsi utama dan menangani error
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Menutup koneksi Prisma
    await prisma.$disconnect();
  });
