import blog1 from '../assets/blog1.webp'
import blog2 from '../assets/blog2.webp'
import blog3 from '../assets/blog3.webp'

/** Services shown on Home / Services. Edit freely. */
export const SERVICES = [
  {
    id: 'neurology',
    name: 'Neurology Service',
    icon: 'bi-activity',
    price: 120,
    duration: '45 min',
    blurb:
      'Expert care for headaches, migraines, nerve conditions and sleep disorders, with a clear plan from day one.',
    points: ['Full neurological assessment', 'Imaging referral if needed', 'Personal treatment plan'],
  },
  {
    id: 'dental',
    name: 'Dental Clinic',
    icon: 'bi-emoji-smile',
    price: 80,
    duration: '30 min',
    blurb: 'Check-ups, cleaning, fillings and cosmetic care in a calm, modern clinic that puts you at ease.',
    points: ['Examination and X-ray', 'Professional cleaning', 'Gentle, pain-aware care'],
  },
  {
    id: 'plastic-surgery',
    name: 'Plastic Surgery',
    icon: 'bi-stars',
    price: 150,
    duration: '60 min',
    blurb: 'Private consultations with board-certified surgeons to discuss options, outcomes and recovery.',
    points: ['One-to-one consultation', 'Realistic outcome planning', 'Aftercare guidance'],
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'bi-heart-pulse',
    price: 140,
    duration: '45 min',
    blurb: 'Heart health screening, ECG and long-term management for blood pressure and cholesterol.',
    points: ['ECG and blood pressure check', 'Risk assessment', 'Lifestyle and medication review'],
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: 'bi-balloon-heart',
    price: 70,
    duration: '30 min',
    blurb: 'Friendly, patient care for babies, children and teenagers, from vaccinations to everyday worries.',
    points: ['Growth and development check', 'Vaccination advice', 'Parent guidance'],
  },
  {
    id: 'general',
    name: 'General Check-up',
    icon: 'bi-clipboard2-pulse',
    price: 60,
    duration: '30 min',
    blurb: 'A complete health review with a general physician, the best starting point if you are unsure.',
    points: ['Vitals and physical exam', 'Lab test advice', 'Referral to a specialist'],
  },
]

/** Used only when the doctors table is empty or Supabase is not configured yet. */
export const SAMPLE_DOCTORS = [
  { id: 's1', name: 'Dr. Suzzane Holroyd', specialty: 'Neurology' },
  { id: 's2', name: 'Dr. Daniel Reyes', specialty: 'Dental' },
  { id: 's3', name: 'Dr. Amelia Hart', specialty: 'Plastic Surgery' },
  { id: 's4', name: 'Dr. Omar Siddiqui', specialty: 'Cardiology' },
]

export const ARTICLES = [
  {
    id: 1,
    image: blog1,
    tag: 'Medical · Dental · Health',
    title: 'Why regular check-ups catch problems before they start',
    comments: 8,
  },
  {
    id: 2,
    image: blog2,
    tag: 'Medical · Dental · Health',
    title: 'How to prepare for your first specialist appointment',
    comments: 5,
  },
  {
    id: 3,
    image: blog3,
    tag: 'Medical · Dental · Health',
    title: 'Modern diagnostics: what to expect from your scan',
    comments: 5,
  },
]

export const FEATURES = [
  { icon: 'bi-calendar2-check', title: 'Book in a minute', text: 'Pick a doctor, choose a time and confirm. No phone calls, no waiting on hold.' },
  { icon: 'bi-person-badge', title: 'Experienced doctors', text: 'Qualified specialists across neurology, dental, cardiology, pediatrics and more.' },
  { icon: 'bi-shield-check', title: 'Private and secure', text: 'Your details are protected with secure sign-in and are only used for your care.' },
  { icon: 'bi-headset', title: '24/7 support', text: 'Our hotline is always open for emergencies and urgent questions.' },
]
