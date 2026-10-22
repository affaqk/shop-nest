import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import { sendContactMessage } from '../services/api'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const contactInfo = [
  { icon: FiMapPin, title: 'Visit Us', lines: ['123 Market Street', 'New York, NY 10001'] },
  { icon: FiPhone, title: 'Call Us', lines: ['+1 (555) 123-4567', 'Mon–Fri, 9am–6pm'] },
  { icon: FiMail, title: 'Email Us', lines: ['support@shopnest.com', 'We reply within 24 hours'] },
  { icon: FiClock, title: 'Working Hours', lines: ['Mon–Fri: 9am – 6pm', 'Sat–Sun: 10am – 4pm'] },
]

const faqs = [
  { q: 'How long does shipping take?', a: 'Orders are shipped within 24 hours and usually arrive in 3–5 business days.' },
  { q: 'What is your return policy?', a: 'You can return any item within 30 days of delivery for a full refund.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship to over 35 countries. Rates are calculated at checkout.' },
]

const Contact = () => {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    await sendContactMessage(Object.fromEntries(new FormData(e.target)))
    e.target.reset()
    setStatus('sent')
  }

  return (
    <>
      <PageHeader
        title="Get in Touch"
        subtitle="Have a question, feedback or need help with an order? Our team is here for you."
        crumbs={[{ label: 'Contact' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map(({ icon: Icon, title, lines }) => (
            <div key={title} className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              {lines.map((line) => (
                <p key={line} className="text-sm text-slate-500">{line}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-10">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-slate-500">Fill out the form and we will get back to you shortly.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Your Name</span>
                <input name="name" required className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
                <input name="email" type="email" required className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Subject</span>
                <select name="subject" className={inputClass}>
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Returns &amp; Refunds</option>
                  <option>Partnerships</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Message</span>
                <textarea name="message" required rows="6" className={`${inputClass} resize-none`} />
              </label>
            </div>
            {status === 'sent' && (
              <p className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <FiCheckCircle /> Thanks! Your message has been sent.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-70"
            >
              <FiSend /> {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate-900">Frequently Asked</h2>
            {faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl bg-white p-5 ring-1 ring-slate-100">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                  {q}
                  <span className="text-xl text-blue-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
