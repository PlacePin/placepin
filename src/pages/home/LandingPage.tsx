import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './landingPage.module.css';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';

const LandingPage = () => {

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  const [units, setUnits] = useState(24);
  const [buildings, setBuildings] = useState(1);
  const [avgRent, setAvgRent] = useState(3500);

  const handleEmailSubmit = async () => {
    setError(null);

    if (contactEmail === '' || !contactEmail.includes('@')) {
      setError('Enter a valid email.')
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsPending(true)

    try {
      const { data } = await axiosInstance.post(
        '/api/features-list/emails',
        {
          contactEmail: contactEmail
        }
      )
      setMessage(data.message)
      setContactEmail('')

      setTimeout(() => {
        setMessage('')
      }, 5000)

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message)
        console.error('Axios Type', error)
        // send to Sentry/DataDog here
      } else if (error instanceof Error) {
        setError(error.message)
        console.error('JS Error Type', error)
        // send to Sentry/DataDog here
      } else {
        setError('Oops something went wrong.')
        console.error('Unknown Error', error)
        // send to Sentry/DataDog here
      }
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsPending(false)
    }
  }

  // Dynamic Industry Constants
  // We calculate Turnover Cost as: 1 month commission + 0.7 month vacancy + $1,500 repairs
  const dynamicTurnoverCost = avgRent + (avgRent * 0.67) + 1500;
  const CHURN_RATE = 0.35;
  const RETAIN_IMPROVEMENT = 0.15;

  const annualSubscription = buildings * 1800;
  const yearlyChurnEvents = units * CHURN_RATE;
  const totalChurnLoss = yearlyChurnEvents * dynamicTurnoverCost;

  const grossSavings = totalChurnLoss * RETAIN_IMPROVEMENT;
  const netSavings = grossSavings - annualSubscription;

  const yearsPaidByOneTenant = (dynamicTurnoverCost / (annualSubscription / buildings)).toFixed(1);

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
          {/* <h3>For Tenants</h3>
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
          </div> */}

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

      <div className={styles.roiCard}>
        <div className={styles.roiHeader}>
          <h3>The PlacePin ROI Engine</h3>
          <p>Dynamic math based on your specific rental profile.</p>
        </div>
        <div className={styles.roiInputs}>
          <div className={styles.inputGroup}>
            <label>Average Monthly Rent: <strong>${avgRent.toLocaleString()}</strong></label>
            <input
              type="range" min="1000" max="10000" step="100"
              value={avgRent} onChange={(e) => setAvgRent(parseInt(e.target.value))}
              className={styles.rangeSlider}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Total Units: <strong>{units}</strong></label>
            <input
              type="range" min="12" max="500" step="1"
              value={units} onChange={(e) => setUnits(parseInt(e.target.value))}
              className={styles.rangeSlider}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Buildings: <strong>{buildings}</strong></label>
            <input
              type="range" min="1" max="20" step="1"
              value={buildings} onChange={(e) => setBuildings(parseInt(e.target.value))}
              className={styles.rangeSlider}
            />
          </div>
        </div>
        <div className={styles.financialBreakdown}>
          {/* Same rows as before, but using dynamicTurnoverCost */}
          <div className={styles.breakdownRow}>
            <span className={styles.hasTooltip}>
              Annual Turnover Loss ⓘ
              <span className={styles.tooltip}>Calculated as 35% churn of {units} units at ${Math.round(dynamicTurnoverCost).toLocaleString()} per vacancy.</span>
            </span>
            <span className={styles.textError}>-${Math.round(totalChurnLoss).toLocaleString()}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.hasTooltip}>
              PlacePin Subscription ({buildings} bldg) ⓘ
              <span className={styles.tooltip}>Flat $150/mo per building. Predictable scaling.</span>
            </span>
            <span className={styles.textNeutral}>-${annualSubscription.toLocaleString()}</span>
          </div>
          <div className={styles.roiSummaryLarge}>
            <span className={styles.summaryLabel}>Projected NOI Increase</span>
            <h2 className={styles.textSuccess}>
              {netSavings > 0
                ? `+$${Math.round(netSavings).toLocaleString()}`
                : "Value Protected"}
            </h2>
            <p className={styles.breakEvenText}>
              Just <strong>one</strong> saved tenant pays for <strong>{yearsPaidByOneTenant} years</strong> of PlacePin.
            </p>
          </div>
        </div>
        <div className={styles.dataSource}>
          <h4>Where do these numbers come from?</h4>
          <ul>
            <li>
              <strong>${Math.round(dynamicTurnoverCost).toLocaleString()} Est. Turnover Cost:</strong>
              {' '}Based on your rent of ${avgRent.toLocaleString()}, this includes a 1-month commission (${avgRent.toLocaleString()}),
              roughly 20 days vacancy (${Math.round(avgRent * 0.67).toLocaleString()}),
              and standard unit prep/repairs ($1,500).
            </li>
            <li>
              <strong>35% Churn:</strong> Standard annual turnover rate for US multi-family housing.
              (Expected <strong>{yearlyChurnEvents.toFixed(1)}</strong> move-outs for your portfolio size).
            </li>
            <li>
              <strong>15% Efficiency:</strong> The targeted percentage of "controllable" moves stopped
              by PlacePin's perks and communication tools.
            </li>
          </ul>
        </div>
      </div>

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
                  <li>✓ $150/month per building + 1% per rent payment — simple, transparent pricing</li>
                  <li>✓ Built for landlords at any stage — from a few units to entire portfolios</li>
                  <li>✓ Unlock tenant perks across all your units</li>
                  <li>✓ Streamline rent collection and tenant communication in one place</li>
                  <li>✓ Flat $150 per building — predictable pricing as you grow</li>
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
                aria-label="Email address for features list"
              />
              <button
                onClick={handleEmailSubmit}
                className={`${styles.submitButton} ${isPending && styles.pending}`}
                disabled={isPending}
                aria-busy={isPending} // Tells users the button is "working"
                aria-label="Submit email"
              >
                {isPending ? 'Sending...' : '→'}
              </button>
            </div>
            <div
              role="alert"
              aria-live="polite"
              className={styles.statusMessage}
            >
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
