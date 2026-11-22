import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, ChevronDown, Gift, Repeat, Calendar, MapPin, Copy, Check } from 'lucide-react'
import { useSiteConfig } from '../context/SiteConfigContext'

const AREAS = [
  'Kota Malang',
  'Kabupaten Malang / Batu',
  'Surabaya',
  'Sidoarjo / Gresik',
  'Pasuruan / Pandaan',
  'Sekitarnya / Luar Kota',
]

const FAQS = [
  {
    q: 'Minimal booking H-berapa?',
    a: 'Idealnya H-7 agar warna & custom nama maksimal. Untuk H-2/H-3 silakan chat WhatsApp untuk cek slot.',
  },
  {
    q: 'Melayani area mana saja?',
    a: 'Kami melayani area Malang, Batu, Surabaya, Sidoarjo, Pasuruan, dan sekitarnya.',
  },
  {
    q: 'Berapa lama pemasangan?',
    a: 'Sekitar 1,5 – 2 jam sebelum acara dimulai, lalu tim kami bantu bongkar properti setelah selesai.',
  },
]

const STEP_ACCENTS = ['#FDEBED', '#EEF3FA', '#FDF4E7', '#F5EEF8']

export function HowToOrderSection() {
  const { config, buildWhatsAppUrl } = useSiteConfig()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [area, setArea] = useState(AREAS[0])
  const [selectedModel, setSelectedModel] = useState(config.models[0]?.name ?? 'Custom')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(waMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const toggleAddon = (label: string) => {
    setSelectedAddons((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const waMessage = [
    `Halo ${config.brand.name}! 🎈`,
    'Saya ingin cek jadwal & konsultasi pemesanan dekorasi:',
    `• Nama: ${name.trim() || '(isi nama)'}`,
    `• Tanggal Acara: ${date || 'Belum pasti'}`,
    `• Area Venue: ${area}`,
    `• Paket: ${selectedModel}`,
    selectedAddons.length > 0 ? `• Add-ons: ${selectedAddons.join(', ')}` : null,
    notes.trim() ? `• Catatan Tema: ${notes.trim()}` : null,
    '',
    'Boleh dibantu info slot & detailnya? Terima kasih ✨',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <section id="cara-pesan" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D98395]">
            Cara Pemesanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#162A4C]">
            4 Langkah <span className="font-display italic font-semibold text-[#D98395]">Anti Ribet</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 sm:mb-14">
          {config.orderSteps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="rounded-[2rem] bg-white p-5 sm:p-6 border border-[#F2D5DC]/65 soft-shadow hover:-translate-y-1 transition-transform"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm text-[#162A4C] mb-4"
                style={{ backgroundColor: STEP_ACCENTS[idx % STEP_ACCENTS.length] }}
              >
                {item.step}
              </div>
              <h3 className="text-base font-extrabold text-[#162A4C] mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#162A4C]/65 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-7 items-start">
          <div className="lg:col-span-7 rounded-[2rem] sm:rounded-[2.25rem] bg-white border border-[#EFAAB6]/40 p-5 sm:p-8 soft-shadow space-y-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#162A4C]">Cek Jadwal via WhatsApp</h3>
              <p className="text-xs text-[#162A4C]/55 mt-0.5">
                Area Malang, Surabaya &amp; sekitarnya — pesan langsung tersusun rapi.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="rounded-2xl border border-[#EFAAB6]/45 bg-[#FFF9FA] px-4 py-2.5 text-sm text-[#162A4C] placeholder:text-[#162A4C]/35 focus:outline-none focus:ring-2 focus:ring-[#EFAAB6]"
              />
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#D98395] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-[#EFAAB6]/45 bg-[#FFF9FA] pl-10 pr-4 py-2.5 text-sm text-[#162A4C] focus:outline-none focus:ring-2 focus:ring-[#EFAAB6]"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#D98395] absolute left-3.5 top-3 pointer-events-none" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-2xl border border-[#EFAAB6]/45 bg-[#FFF9FA] pl-10 pr-4 py-2.5 text-sm text-[#162A4C] focus:outline-none focus:ring-2 focus:ring-[#EFAAB6]"
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="rounded-2xl border border-[#EFAAB6]/45 bg-[#FFF9FA] px-4 py-2.5 text-sm text-[#162A4C] focus:outline-none focus:ring-2 focus:ring-[#EFAAB6]"
              >
                {config.models.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.size})
                  </option>
                ))}
                <option value="Custom Konsep Sendiri">Custom Konsep Sendiri</option>
              </select>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#162A4C] mb-2">Add-ons Opsional:</span>
              <div className="flex flex-wrap gap-2">
                {config.addons.map((addon) => {
                  const active = selectedAddons.includes(addon)
                  return (
                    <button
                      key={addon}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#162A4C] border-[#162A4C] text-white'
                          : 'bg-[#FFF9FA] border-[#EFAAB6]/45 text-[#162A4C]/75 hover:bg-[#FDEBED]'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {addon}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan warna / tulisan nama (opsional)"
                className="flex-1 rounded-full border border-[#EFAAB6]/45 bg-[#FFF9FA] px-4 py-3 text-sm text-[#162A4C] placeholder:text-[#162A4C]/35 focus:outline-none focus:ring-2 focus:ring-[#EFAAB6]"
              />
              <button
                type="button"
                onClick={handleCopyMessage}
                title="Salin Format Pesan"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#D98395]" />}
                <span>{copied ? 'Disalin!' : 'Salin'}</span>
              </button>
              <a
                href={buildWhatsAppUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#162A4C] text-white text-sm font-bold shadow-lg shadow-[#162A4C]/20 hover:bg-[#243E6B] hover:-translate-y-0.5 transition-all shrink-0"
              >
                <Send className="w-4 h-4 text-[#F2B3BD]" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-[2rem] bg-[#162A4C] text-white p-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-white/10 p-3.5 space-y-1">
                <span className="inline-flex items-center gap-1 font-extrabold text-[#F2B3BD]">
                  <Gift className="w-3.5 h-3.5" /> Milik Kamu
                </span>
                <p className="text-white/75 leading-relaxed">
                  Semua balon, foil, pita satin &amp; stiker nama.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3.5 space-y-1">
                <span className="inline-flex items-center gap-1 font-extrabold text-[#DFBE8A]">
                  <Repeat className="w-3.5 h-3.5" /> Dipinjamkan
                </span>
                <p className="text-white/75 leading-relaxed">
                  Backdrop, meja silinder/acrylic, lampu &amp; shimmer wall.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-white border border-[#F2D5DC]/70 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-[#162A4C]">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#D98395] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-3.5 text-xs text-[#162A4C]/65 leading-relaxed border-t border-[#FFF2F4] pt-2.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
