import styles from './landingPage.module.css';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useState } from 'react';
import axios from 'axios';

const LandingPage = () => {

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async () => {

    if (contactEmail === '' || !contactEmail.includes('@')) {
      setError('Enter a valid email.')
      return
    }

    try {
      const { data } = await axiosInstance.post(
        '/api/features-list/emails',
        contactEmail
      )
      setIsPending(true)
      setMessage(data.message)

      const timeout = setTimeout(() => {
        setMessage('')
        clearTimeout(timeout)
      }, 3000)

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message)
        console.error('Axios Type', error)
        // send to Sentry/DataDog here
      } else if (error instanceof Error) {
        setError(error.message)
        console.error('JS Error Type', error)
        // send to Sentry/DataDog here
      } else {
        console.error('Unknown Error', error)
        // send to Sentry/DataDog here
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <a href='#' className={styles.footerLogo}>PlacePin</a>
          </div>
          <nav className={styles.nav}>
            <a href="#how-it-works">How it Works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <NavLink to='/signup'>
            <button className={styles.ctaButton}>Get Started</button>
          </NavLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Better Living. Better Management.</h1>
            <p>Smart services for tenants. Smarter solutions for landlords.</p>
            <div className={styles.heroButtons}>
              <NavLink to='/signup'>
                <button className={styles.primaryButton}>Get Started</button>
              </NavLink>
              <a href="#features"><button className={styles.secondaryButton}>Learn More</button></a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div>
              <img className={styles.sphere} src='/housing.webp' alt='city' />
              <div className={`${styles.uiElement} ${styles.theme}`}>
                <span>🏙️</span>
                <span>Elevate Your Living</span>
              </div>
              <div className={`${styles.uiElement} ${styles.changing}`}>
                <span>🔑</span>
                <span>The Future of Renting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorksSection} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Simple steps to get started — whether you're a tenant or a landlord.</p>
          </div>

          {/* Tenant Steps */}
          <h3>For Tenants</h3>
          <div className={styles.stepsCards}>
            <div className={styles.stepCard}>
              <div className={styles.icon}>🔍</div>
              <h4>Find Your Home</h4>
              <p>Search available listings and discover apartments with the perks you want.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.icon}>📝</div>
              <h4>Apply Securely</h4>
              <p>Submit applications and sign leases online with ease and confidence.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.icon}>💳</div>
              <h4>Pay & Enjoy</h4>
              <p>Pay rent, track expenses, and enjoy exclusive perks directly through our platform.</p>
            </div>
          </div>

          {/* Landlord Steps */}
          <h3>For Landlords</h3>
          <div className={styles.stepsCards}>
            <div className={styles.stepCard}>
              <div className={styles.icon}>🏢</div>
              <h4>List Your Property</h4>
              <p>Add your building and units to the platform in minutes.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.icon}>📊</div>
              <h4>Track & Manage</h4>
              <p>Monitor rent collection, tenant activity, and building performance all in one place.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.icon}>🤝</div>
              <h4>Engage Tenants</h4>
              <p>Offer perks and services that boost tenant satisfaction and retention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools tenants love Section */}
      <section className={styles.launchSection} id="features">
        <div className={styles.container}>
          <div className={styles.launchContent}>
            <h2>Services Tenants Love, Tools Landlords Trust</h2>
            <p>Our platform connects tenants with curated perks and services while giving landlords powerful tools to manage their properties effortlessly. Everyone wins.</p>
          </div>
          <div className={styles.featureCards}>
            <div className={styles.featureCard}>
              <div className={styles.featureVisual}>
                <div>
                  <img src='/tenantPerks.webp' alt='tenant perks' className={styles.tenantPerks} />
                </div>
              </div>
              <h3>Tenant Perks</h3>
              <p>Laundry, housekeeping, gym access, and exclusive discounts—your home just got an upgrade.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureVisual}>
                <img src='/charts.webp' alt='charts' className={styles.charts} />
              </div>
              <h3>Landlord Tools</h3>
              <p>Property tools, rent collection, and tenant communication all in one place for landlords.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureVisual}>
                <div className={styles.publishButton}>
                  <span>Upgrade</span>
                  <div className={styles.cursor}>👆</div>
                </div>
              </div>
              <h3>Flexible Plans</h3>
              <p>Comfort, Premium, Luxury, and Luxury Plus—tenants choose the plan that fits their lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection} id="pricing">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Affordable Plans For Everyone.</h2>
            <p>Get the features you need without breaking the bank. Our flexible plans fit teams of all sizes, helping you start strong and scale effortlessly with clear, transparent pricing.</p>
          </div>
          <div className={`${styles.pricingCards} ${styles.singleCard}`}>
            <div className={`${styles.pricingCard} ${styles.landlordCard}`}>
              <div className={styles.planLabel}>LANDLORDS</div>
              <h3>Building Plan</h3>
              <div className={styles.price}>$150<span> subscription per building</span></div>
              <button className={styles.primaryButton}>Start Managing &gt;</button>
              <div className={`${styles.features} ${styles.landlordFeatures}`}>
                <h4>For property owners</h4>
                <ul>
                  <li>✓ Transparent fee based on your building's expected gross rental income</li>
                  <li>✓ Tailored for landlords with scalable services, and full management support for 10+ units.</li>
                  <li>✓ Access to tenant perks across all your units</li>
                  <li>✓ Tools to streamline rent tracking and communications</li>
                  <li>✓ Scales with property size — more units, more value</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <div className={styles.planLabel}>TENANTS</div>
              <h3>Essential</h3>
              <div className={styles.price}>$50<span>/month</span></div>
              <button className={styles.secondaryButton}>Get Started &gt;</button>
              <div className={styles.features}>
                <h4>Perfect for individuals</h4>
                <ul>
                  <li>✓ Laundry service (basic)</li>
                  <li>✓ Limited housekeeping visits</li>
                  <li>✓ Discounts on food & groceries</li>
                  <li>✓ Access to partner gyms</li>
                </ul>
              </div>
            </div>
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>MOST POPULAR</div>
              <div className={styles.planLabel}>TENANTS</div>
              <h3>Balanced</h3>
              <div className={styles.price}>$120<span>/month</span></div>
              <button className={styles.primaryButton}>Get Started &gt;</button>
              <div className={styles.features}>
                <h4>Great for small households</h4>
                <ul>
                  <li>✓ Everything in Essential</li>
                  <li>✓ More frequent laundry</li>
                  <li>✓ Higher partner discounts</li>
                  <li>✓ Early access to new perks</li>
                </ul>
              </div>
            </div>
            <div className={styles.pricingCard}>
              <div className={styles.planLabel}>TENANTS</div>
              <h3>Platinum</h3>
              <div className={styles.price}>$200<span>/month</span></div>
              <button className={styles.secondaryButton}>Get Started &gt;</button>
              <div className={styles.features}>
                <h4>Made for premium living</h4>
                <ul>
                  <li>✓ Everything in Balanced</li>
                  <li>✓ Concierge services</li>
                  <li>✓ Priority scheduling</li>
                  <li>✓ VIP experiences & events</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection} id="contact">
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <p>Stay in the loop. Enter your email and be the first to know when new features roll out.</p>
          </div>
          <div className={styles.ctaForm}>
            <p>Just send us your email and we will contact you.</p>
            <div className={styles.emailInput}>
              <input
                type="email"
                placeholder="Your@email.com"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
              />
              <button
                onClick={handleEmailSubmit}
                className={styles.submitButton}>
                {isPending ? 'Sending...' : '→'}
              </button>
            </div>
            {message && (
              <p
                className={styles.message}
              >
                {message}
              </p>
            )}
            {error && (
              <p
                className={styles.error}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div>
            <div className={styles.logo}>
              <div className={styles.logoIcon}></div>
              <a className={styles.logoWord} href='#'>PlacePin</a>
            </div>
            <p>Smart services for tenants. Smarter solutions for landlords.</p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Explore</h4>
              <a href="#how-it-works">How it Works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>About</h4>
              <NavLink to='/privacypolicy'>Privacy Policy</NavLink>
              <NavLink to='/termsofservice'>Terms of Service</NavLink>
            </div>
          </div>

          <div className={styles.footerCta}>
            <NavLink to='/signup'>
              <button className={styles.primaryButton}>Get Started →</button>
            </NavLink>
          </div>

          <div>
            <p>© 2025 PlacePin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
