import { useNavigate } from 'react-router-dom';
import styles from './privacyPolicy.module.css';

const PrivacyPolicy = () => {

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  const sections = [
    {
      title: 'Introduction',
      content: 'PlacePin ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our tenant management and retention platform.'
    },
    {
      title: 'Information We Collect',
      content: 'We collect the following personal information that you provide to us directly:',
      list: ['Full name', 'Email address', 'Gender', 'Age', 'Current living address', 'Property ownership address (if applicable)', 'We use a third-party payment processor (Stripe) to handle all payment transactions. When you enter your payment information, such as debit or credit card details, this information is transmitted directly to Stripe and is not stored on our servers.', 'We may receive limited information from Stripe, such as a payment method ID, transaction status, and billing-related metadata, which we use to manage your subscription.']
    },
    {
      title: 'How We Use Your Information',
      content: 'We use your personal information for the following purposes:',
      list: [
        'To provide and improve our tenant management and retention services',
        'To analyze tenant behavior patterns and predict likelihood of tenant turnover',
        'To provide landlords with insights into tenant retention and reasons for tenant departure or continued residency',
        'To enhance user experience on our platform',
        'To communicate with you about our services'
      ]
    },
    {
      title: 'Data Anonymization and Analytics',
      content: 'Your personal data is anonymized when used for analysis purposes. This means we remove personally identifiable information before analyzing trends in tenant behavior. These anonymized insights help landlords understand retention patterns without revealing individual tenant identities.'
    },
    {
      title: 'How We Protect Your Information',
      content: 'We take data security seriously and implement the following measures:',
      list: [
        'All data is encrypted on our backend infrastructure',
        'Security measures are in place to protect against data leaks and unauthorized access',
        'Access to personal information is restricted to authorized personnel only'
      ]
    },
    {
      title: 'Data Sharing',
      content: "We do not sell or rent your personal information. However, we may share necessary information with trusted third-party service providers, such as Stripe, to process payments and provide our services."
    },
    {
      title: 'Your Rights and Choices',
      content: 'You have the right to:',
      list: [
        'Access your personal information',
        'Update your personal information through your account settings',
        'Delete your account and all associated data directly from the app settings'
      ],
      footer: 'When you delete your account, all of your personal information will be permanently removed from our systems.'
    },
    {
      title: 'Cookies',
      content: 'PlacePin does not use cookies or similar tracking technologies.'
    },
    {
      title: "Children's Privacy",
      content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.'
    },
    {
      title: 'Changes to This Privacy Policy',
      content: 'We may update this Privacy Policy from time to time. When we make changes, we will update the "Last Updated" date at the top of this policy. We encourage you to review this policy periodically.'
    },
    {
      title: 'Contact Us',
      content: 'If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:',
      contact: true
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <button
            onClick={handleBack}
            className={styles.back}
          >
            ← Back
          </button>
          <p className={styles.eyebrow}>PlacePin · Legal</p>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: February 16, 2026</p>
        </div>
      </div>

      <div className={styles.content}>
        {sections.map((section, index) => (
          <div key={index} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
            </div>

            <div className={styles.sectionBody}>
              <p className={`${styles.paragraph} ${section.list ? styles.paragraphWithList : ''}`}>
                {section.content}
              </p>

              {section.list && (
                <ul className={styles.list}>
                  {section.list.map((item, i) => (
                    <li key={i} className={styles.listItem}>
                      <span className={styles.listDot} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className={styles.footerNote}>{section.footer}</p>
              )}

              {section.contact && (
                <div className={styles.contactBlock}>
                  <p className={styles.contactLine}>
                    <strong>Email:</strong> support@placepin.com
                  </p>
                  <p className={styles.contactLine}>
                    <strong>Address:</strong> 1452 Dorchester Ave 4th fl, Dorchester, MA 02122
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;