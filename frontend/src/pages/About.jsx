import { Link } from 'react-router'
import { FiAward, FiHeart, FiGlobe, FiUsers, FiArrowRight } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'

const values = [
  { icon: FiAward, title: 'Uncompromising Quality', text: 'Every product is tested and approved by our team before it reaches you.' },
  { icon: FiHeart, title: 'Customer First', text: 'Friendly support, easy returns and an experience built around you.' },
  { icon: FiGlobe, title: 'Sustainable Choices', text: 'We partner with makers who care about people and the planet.' },
  { icon: FiUsers, title: 'Community Driven', text: 'Your feedback shapes what we stock and how we grow.' },
]

const team = [
  { name: 'Olivia Bennett', role: 'Founder & CEO', seed: 'team1' },
  { name: 'Daniel Park', role: 'Head of Product', seed: 'team2' },
  { name: 'Sofia Martinez', role: 'Creative Director', seed: 'team3' },
  { name: 'James Wilson', role: 'Customer Experience', seed: 'team4' },
]

const About = () => (
  <>
    <PageHeader
      title="About ShopNest"
      subtitle="We started with a simple idea: great products should be easy to find, fairly priced and a joy to own."
      crumbs={[{ label: 'About' }]}
    />

    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-4">
        <img src="https://picsum.photos/seed/about1/500/650" alt="" className="h-80 w-full rounded-3xl object-cover" />
        <img src="https://picsum.photos/seed/about2/500/650" alt="" className="mt-12 h-80 w-full rounded-3xl object-cover" />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Our Story</p>
        <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
          From a small idea to a store loved by thousands
        </h2>
        <div className="mt-6 space-y-4 leading-relaxed text-slate-600">
          <p>
            ShopNest was founded in 2020 by a small team of shoppers who were tired of endless scrolling, unreliable
            sellers and confusing checkouts. We set out to build a store we would actually want to shop at.
          </p>
          <p>
            Today we serve over 50,000 customers worldwide with a carefully curated selection of products across
            fashion, electronics, home and beauty, and we are just getting started.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
          {[
            ['50K+', 'Customers'],
            ['1.2K+', 'Products'],
            ['35+', 'Countries'],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-semibold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Our Values" title="What We Stand For" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-slate-50 p-8 transition hover:bg-blue-50">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20">
      <SectionHeading eyebrow="Our Team" title="The People Behind ShopNest" />
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {team.map((member) => (
          <div key={member.name} className="group text-center">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={`https://picsum.photos/seed/${member.seed}/400/480`}
                alt={member.name}
                loading="lazy"
                className="aspect-[5/6] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 font-semibold text-slate-900">{member.name}</p>
            <p className="text-sm text-slate-500">{member.role}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 px-8 py-16 text-center text-white">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to find something you love?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">Explore our latest collections and enjoy free shipping on orders over $50.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 hover:bg-blue-50"
        >
          Start Shopping <FiArrowRight />
        </Link>
      </div>
    </section>
  </>
)

export default About
