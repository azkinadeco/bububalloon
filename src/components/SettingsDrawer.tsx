import React, { useState } from 'react'
import { X, RotateCcw, Plus, Trash2, Check, Upload, Download } from 'lucide-react'
import { useSiteConfig, DesignModel, SiteConfig } from '../context/SiteConfigContext'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

type SettingsTab = 'umum' | 'paket' | 'pesan' | 'portofolio'

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { config, updateConfig, resetConfig } = useSiteConfig()
  const [tab, setTab] = useState<SettingsTab>('umum')
  const [savedNotice, setSavedNotice] = useState(false)

  if (!open) return null

  const flashSaved = () => {
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 1600)
  }

  const handleImageFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    onDataUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onDataUrl(reader.result)
        flashSaved()
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-[#162A4C]/35 backdrop-blur-sm flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#FDEBED]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#FDEBED] flex items-center justify-between bg-[#FFF9FA]">
          <div>
            <h2 className="text-base font-extrabold text-[#162A4C]">Pengaturan Konten Web</h2>
            <p className="text-[11px] font-medium text-[#162A4C]/55">
              Perubahan langsung tersimpan otomatis di browser ini.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                <Check className="w-3 h-3" /> Tersimpan
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Pengaturan"
              className="w-8 h-8 rounded-full bg-[#FDEBED] text-[#162A4C] flex items-center justify-center hover:bg-[#F7D3DA] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2.5 border-b border-[#FDEBED] grid grid-cols-4 gap-1 bg-white">
          {[
            { id: 'umum' as const, label: 'Umum' },
            { id: 'paket' as const, label: 'Paket' },
            { id: 'pesan' as const, label: 'Cara Pesan' },
            { id: 'portofolio' as const, label: 'Portofolio' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                tab === t.id
                  ? 'bg-[#162A4C] text-white'
                  : 'text-[#162A4C]/65 hover:bg-[#FFF5F7]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: UMUM & KONTAK */}
          {tab === 'umum' && (
            <div className="space-y-3.5">
              {[
                { key: 'name', label: 'Nama Brand' },
                { key: 'subtitle', label: 'Subjudul Brand' },
                { key: 'heroBadge', label: 'Badge Atas Hero' },
                { key: 'heroTitle', label: 'Judul Hero (Baris 1)' },
                { key: 'heroHighlight', label: 'Judul Hero (Sorotan Pink)' },
                { key: 'heroSubtitle', label: 'Subjudul Hero Singkat' },
                { key: 'whatsappNumber', label: 'Nomor WhatsApp (Format 62...)' },
                { key: 'instagram', label: 'Akun Instagram' },
                { key: 'location', label: 'Area Layanan' },
                { key: 'hours', label: 'Jam Operasional' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={config.brand[field.key as keyof typeof config.brand]}
                    onChange={(e) => {
                      const val = e.target.value
                      updateConfig((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, [field.key]: val },
                      }))
                      flashSaved()
                    }}
                    className="w-full rounded-xl border border-[#EFAAB6]/50 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C] focus:outline-none focus:ring-2 focus:ring-[#EFAAB6]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: MODEL PAKET & ADD-ONS (TANPA HARGA) */}
          {tab === 'paket' && (
            <div className="space-y-5">
              {config.models.map((model, idx) => (
                <div
                  key={model.id}
                  className="rounded-2xl border border-[#F2D5DC] bg-[#FFF9FA] p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#D98395]">Paket #{idx + 1}</span>
                    {config.models.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            models: prev.models.filter((m) => m.id !== model.id),
                          }))
                          flashSaved()
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Hapus Paket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={model.name}
                    placeholder="Nama Paket"
                    onChange={(e) => {
                      const val = e.target.value
                      updateConfig((prev) => ({
                        ...prev,
                        models: prev.models.map((m) => (m.id === model.id ? { ...m, name: val } : m)),
                      }))
                      flashSaved()
                    }}
                    className="w-full rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs font-bold text-[#162A4C]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={model.size}
                      placeholder="Ukuran (misal 2,4m × 2,2m)"
                      onChange={(e) => {
                        const val = e.target.value
                        updateConfig((prev) => ({
                          ...prev,
                          models: prev.models.map((m) => (m.id === model.id ? { ...m, size: val } : m)),
                        }))
                        flashSaved()
                      }}
                      className="rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs text-[#162A4C]"
                    />
                    <select
                      value={model.category}
                      onChange={(e) => {
                        const val = e.target.value as DesignModel['category']
                        updateConfig((prev) => ({
                          ...prev,
                          models: prev.models.map((m) =>
                            m.id === model.id ? { ...m, category: val } : m
                          ),
                        }))
                        flashSaved()
                      }}
                      className="rounded-xl border border-[#EFAAB6]/50 bg-white px-2.5 py-1.5 text-xs text-[#162A4C]"
                    >
                      <option value="Ulang Tahun">Ulang Tahun</option>
                      <option value="Sweet 17">Sweet 17</option>
                      <option value="Kids & Baby">Kids & Baby</option>
                      <option value="Intimate & Bridal">Intimate & Bridal</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    value={model.description}
                    placeholder="Deskripsi singkat"
                    onChange={(e) => {
                      const val = e.target.value
                      updateConfig((prev) => ({
                        ...prev,
                        models: prev.models.map((m) =>
                          m.id === model.id ? { ...m, description: val } : m
                        ),
                      }))
                      flashSaved()
                    }}
                    className="w-full rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs text-[#162A4C]"
                  />

                  <div>
                    <label className="block text-[10px] font-bold text-[#162A4C]/65 mb-1">
                      Spesifikasi (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={model.includes.join(', ')}
                      onChange={(e) => {
                        const list = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                        updateConfig((prev) => ({
                          ...prev,
                          models: prev.models.map((m) =>
                            m.id === model.id ? { ...m, includes: list } : m
                          ),
                        }))
                        flashSaved()
                      }}
                      className="w-full rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs text-[#162A4C]"
                    />
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EFAAB6]/60 text-[11px] font-bold text-[#162A4C] cursor-pointer hover:bg-[#FDEBED]">
                    <Upload className="w-3 h-3 text-[#D98395]" />
                    Ganti Foto Paket
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFile(e, (url) => {
                          updateConfig((prev) => ({
                            ...prev,
                            models: prev.models.map((m) =>
                              m.id === model.id ? { ...m, image: url } : m
                            ),
                          }))
                        })
                      }
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  updateConfig((prev) => ({
                    ...prev,
                    models: [
                      ...prev.models,
                      {
                        id: `custom-${Date.now()}`,
                        name: 'Model Baru Bubu',
                        category: 'Ulang Tahun',
                        tag: 'Baru',
                        size: '2,5m × 2,2m',
                        description: 'Dekorasi balon modern custom warna sesuai tema.',
                        image: '',
                        colors: ['#FDEBED', '#EFAAB6', '#162A4C'],
                        includes: ['Arch Backdrop', 'Organic Garland', 'Custom Nama'],
                        studioPresetId: 'bubu-signature',
                      },
                    ],
                  }))
                  flashSaved()
                }}
                className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#EFAAB6] text-xs font-extrabold text-[#162A4C] flex items-center justify-center gap-1.5 hover:bg-[#FFF5F7] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D98395]" />
                Tambah Model Paket
              </button>

              {/* Add-ons Editor */}
              <div className="pt-3 border-t border-[#FDEBED]">
                <label className="block text-xs font-extrabold text-[#162A4C] mb-1">
                  Daftar Add-ons (pisahkan dengan koma)
                </label>
                <textarea
                  rows={2}
                  value={config.addons.join(', ')}
                  onChange={(e) => {
                    const list = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    updateConfig((prev) => ({ ...prev, addons: list }))
                    flashSaved()
                  }}
                  className="w-full rounded-xl border border-[#EFAAB6]/50 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CARA PESAN */}
          {tab === 'pesan' && (
            <div className="space-y-3.5">
              {config.orderSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className="rounded-2xl border border-[#F2D5DC] bg-[#FFF9FA] p-4 space-y-2"
                >
                  <span className="text-[11px] font-extrabold text-[#D98395]">Langkah {step.step}</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateConfig((prev) => ({
                        ...prev,
                        orderSteps: prev.orderSteps.map((s, i) =>
                          i === idx ? { ...s, title: val } : s
                        ),
                      }))
                      flashSaved()
                    }}
                    className="w-full rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs font-bold text-[#162A4C]"
                  />
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateConfig((prev) => ({
                        ...prev,
                        orderSteps: prev.orderSteps.map((s, i) =>
                          i === idx ? { ...s, description: val } : s
                        ),
                      }))
                      flashSaved()
                    }}
                    className="w-full rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs text-[#162A4C]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PORTOFOLIO */}
          {tab === 'portofolio' && (
            <div className="space-y-3.5">
              {config.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#F2D5DC] bg-[#FFF9FA] p-4 space-y-2"
                >
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateConfig((prev) => ({
                        ...prev,
                        portfolio: prev.portfolio.map((p) =>
                          p.id === item.id ? { ...p, title: val } : p
                        ),
                      }))
                      flashSaved()
                    }}
                    className="w-full rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs font-bold text-[#162A4C]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.eventType}
                      placeholder="Acara"
                      onChange={(e) => {
                        const val = e.target.value
                        updateConfig((prev) => ({
                          ...prev,
                          portfolio: prev.portfolio.map((p) =>
                            p.id === item.id ? { ...p, eventType: val } : p
                          ),
                        }))
                        flashSaved()
                      }}
                      className="rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs text-[#162A4C]"
                    />
                    <input
                      type="text"
                      value={item.location}
                      placeholder="Lokasi"
                      onChange={(e) => {
                        const val = e.target.value
                        updateConfig((prev) => ({
                          ...prev,
                          portfolio: prev.portfolio.map((p) =>
                            p.id === item.id ? { ...p, location: val } : p
                          ),
                        }))
                        flashSaved()
                      }}
                      className="rounded-xl border border-[#EFAAB6]/50 bg-white px-3 py-1.5 text-xs text-[#162A4C]"
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EFAAB6]/60 text-[11px] font-bold text-[#162A4C] cursor-pointer hover:bg-[#FDEBED]">
                    <Upload className="w-3 h-3 text-[#D98395]" />
                    Upload Foto Portofolio
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFile(e, (url) => {
                          updateConfig((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p) =>
                              p.id === item.id ? { ...p, image: url } : p
                            ),
                          }))
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#FDEBED] bg-[#FFF9FA] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetConfig()
                flashSaved()
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'bubu-balloon-config.json'
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#162A4C]/75 hover:text-[#162A4C] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Backup
            </button>
            <label className="inline-flex items-center gap-1 text-xs font-bold text-[#162A4C]/75 hover:text-[#162A4C] cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    try {
                      const parsed = JSON.parse(String(reader.result)) as SiteConfig
                      if (parsed.brand && parsed.models) {
                        updateConfig(() => parsed)
                        flashSaved()
                      }
                    } catch {
                      // ignore invalid JSON
                    }
                  }
                  reader.readAsText(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#162A4C] text-white text-xs font-bold hover:bg-[#243E6B] cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
