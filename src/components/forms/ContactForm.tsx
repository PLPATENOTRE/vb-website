'use client'

import { useState } from 'react'
import Turnstile from 'react-turnstile'
import type { ContactApiResponse, ContactPayload } from '@/types'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

interface FormState {
  nom: string
  prenom: string
  email: string
  telephone: string
  message: string
}

const INITIAL_STATE: FormState = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  message: '',
}

// Ping GoatCounter d'une conversion (event nommé, pas une page → n'inflate pas les pages vues).
// No-op si le beacon est absent (bloqueur de pub, SSR) : la mesure est best-effort, jamais bloquante.
function trackConversion() {
  const gc = (window as unknown as { goatcounter?: { count?: (v: object) => void } }).goatcounter
  gc?.count?.({ path: 'contact-envoi', title: 'Formulaire de contact envoyé', event: true })
}

export function ContactForm() {
  const [fields, setFields] = useState<FormState>(INITIAL_STATE)
  const [token, setToken] = useState<string>('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.currentTarget
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!token) {
      setStatus('error')
      setErrorMsg("Merci de valider l'anti-spam.")
      return
    }

    setStatus('sending')
    setErrorMsg('')

    const payload: ContactPayload = {
      nom: fields.nom,
      prenom: fields.prenom || undefined,
      email: fields.email,
      telephone: fields.telephone || undefined,
      message: fields.message,
      token,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const raw: unknown = await res.json()
      // garde de type : une page d'erreur proxy/CDN ne ressemble pas à ContactApiResponse.
      if (
        typeof raw !== 'object' ||
        raw === null ||
        typeof (raw as { ok?: unknown }).ok !== 'boolean'
      ) {
        throw new Error('Réponse inattendue')
      }
      const data = raw as ContactApiResponse

      if (data.ok) {
        trackConversion()
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMsg(data.error ?? 'Une erreur est survenue. Veuillez réessayer.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur réseau est survenue. Veuillez réessayer.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-[#EEEBE2] bg-white p-10 shadow-[0_10px_30px_rgba(46,71,57,0.06)]">
        <p
          className="font-mulish text-[17px] leading-[1.85] text-forest"
          role="status"
          aria-live="polite"
        >
          Message envoyé. Je reviens vers vous rapidement.
        </p>
      </div>
    )
  }

  const fieldClass =
    'w-full rounded-lg border border-[#E0DDD2] bg-white px-4 py-3.5 font-mulish text-[15px] text-forest placeholder:text-[#b3afa3] outline-none transition-colors focus:border-forest'

  return (
    <div className="rounded-xl border border-[#EEEBE2] bg-white p-10 shadow-[0_10px_30px_rgba(46,71,57,0.06)]">
      <h2 className="mb-6 font-cormorant text-[32px] font-semibold leading-tight text-forest">
        Formulaire de contact
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-[18px]">
          {/* Nom / Prénom */}
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
            <div>
              <label htmlFor="nom" className="mb-1.5 block font-mulish text-[13px] text-[#6B7670]">
                Nom <span className="text-rose">*</span>
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                className={fieldClass}
                placeholder="Votre nom"
                value={fields.nom}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
            <div>
              <label
                htmlFor="prenom"
                className="mb-1.5 block font-mulish text-[13px] text-[#6B7670]"
              >
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                className={fieldClass}
                placeholder="Votre prénom"
                value={fields.prenom}
                onChange={handleChange}
                autoComplete="given-name"
              />
            </div>
          </div>

          {/* E-mail / Téléphone */}
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-mulish text-[13px] text-[#6B7670]"
              >
                E-mail <span className="text-rose">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={fieldClass}
                placeholder="vous@exemple.fr"
                value={fields.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="telephone"
                className="mb-1.5 block font-mulish text-[13px] text-[#6B7670]"
              >
                Téléphone
              </label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                className={fieldClass}
                placeholder="06 …"
                value={fields.telephone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block font-mulish text-[13px] text-[#6B7670]"
            >
              Votre message <span className="text-rose">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className={`${fieldClass} resize-y`}
              placeholder="Décrivez votre situation : type de local, étape du bail, question principale…"
              value={fields.message}
              onChange={handleChange}
              required
            />
          </div>

          {/* Turnstile */}
          <div>
            {siteKey ? (
              <Turnstile sitekey={siteKey} onVerify={(t) => setToken(t)} />
            ) : (
              <p className="font-mulish text-[12px] text-[#9b9588]">
                [À compléter] clé Turnstile (NEXT_PUBLIC_TURNSTILE_SITE_KEY manquante)
              </p>
            )}
          </div>

          {/* Zone statut */}
          <div aria-live="polite" role="status" className="min-h-[20px]">
            {status === 'error' && errorMsg && (
              <p className="font-mulish text-[13px] text-rose">{errorMsg}</p>
            )}
          </div>

          {/* Footer formulaire */}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mulish text-[12px] text-[#9b9588]">* Champs obligatoires</span>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-forest px-10 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Envoi…' : 'Envoyer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
