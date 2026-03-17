import styles from './termsOfService.module.css';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'Welcome to PlacePin. By accessing or using our tenant management and retention platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.'
  },
  {
    title: 'Description of Service',
    content: 'PlacePin provides a property technology platform that helps landlords manage tenants and improve retention through data analytics. Our Service analyzes tenant behavior patterns to provide insights into tenant retention and turnover.'
  },
  {
    title: 'Eligibility',
    content: 'You must be at least 18 years old to use our Service. By using PlacePin, you represent and warrant that you meet this age requirement.'
  },
  {
    title: 'Account Registration',
    content: 'To use our Service, you must create an account by providing accurate and complete information, including:',
    list: [
      'Full name',
      'Email address',
      'Gender',
      'Age',
      'Current living address',
      'Property ownership address (if applicable)'
    ],
    footer: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
  },
  {
    title: 'User Responsibilities',
    content: 'You agree to:',
    list: [
      'Provide accurate, current, and complete information',
      'Update your information promptly if it changes',
      'Use the Service only for lawful purposes',
      'Not attempt to gain unauthorized access to our systems',
      'Not interfere with or disrupt the Service',
      'Not use the Service to harass, abuse, or harm others',
      'Not impersonate any person or entity'
    ]
  },
  {
    title: 'Data Usage',
    content: 'By using our Service, you acknowledge and agree that:',
    list: [
      'We collect and use your personal information as described in our Privacy Policy',
      'We may anonymize your data to generate insights and analytics',
      'Landlords using our Service may receive anonymized insights about tenant behavior patterns',
      'You retain ownership of your personal data'
    ]
  },
  {
    title: 'Intellectual Property',
    content: 'All content, features, and functionality of the PlacePin Service, including but not limited to text, graphics, logos, software, and analytics tools, are owned by PlacePin and are protected by copyright, trademark, and other intellectual property laws.',
    list: [
      'Copy, modify, or distribute our Service or content',
      'Reverse engineer or attempt to extract source code',
      'Remove any copyright or proprietary notices'
    ],
    listPrefix: 'You may not:'
  },
  {
    title: 'Account Termination',
    content: 'You may terminate your account at any time through the app settings. Upon termination, all your personal data will be deleted from our systems as described in our Privacy Policy.',
    footer: 'We reserve the right to suspend or terminate your account if you violate these Terms or engage in conduct that we determine to be harmful to other users, us, or third parties.'
  },
  {
    title: 'Disclaimers',
    uppercase: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.',
    content: 'PlacePin does not guarantee that:',
    list: [
      'The Service will be uninterrupted, secure, or error-free',
      'The results or insights provided will be accurate or reliable',
      'Any errors or defects will be corrected'
    ]
  },
  {
    title: 'Limitation of Liability',
    uppercase: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, PLACEPIN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.\n\nIN NO EVENT SHALL PLACEPIN'S TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY."
  },
  {
    title: 'Indemnification',
    content: 'You agree to indemnify, defend, and hold harmless PlacePin and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney\'s fees, arising out of or in any way connected with your use of the Service or violation of these Terms.'
  },
  {
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last Updated" date at the top of these Terms. Your continued use of the Service after changes constitutes acceptance of the modified Terms.'
  },
  {
    title: 'Changes to Service',
    content: 'We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.'
  },
  {
    title: 'Governing Law',
    content: 'These Terms shall be governed by and construed in accordance with the laws of Massachusetts, without regard to its conflict of law provisions.'
  },
  {
    title: 'Dispute Resolution',
    content: 'Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in court to prevent infringement of intellectual property rights.'
  },
  {
    title: 'Severability',
    content: 'If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.'
  },
  {
    title: 'Entire Agreement',
    content: 'These Terms, together with our Privacy Policy, constitute the entire agreement between you and PlacePin regarding the use of our Service and supersede any prior agreements.'
  },
  {
    title: 'Contact Information',
    content: 'If you have questions about these Terms, please contact us at:',
    contact: true
  }
];

const TermsOfService = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>PlacePin · Legal</p>
          <h1 className={styles.title}>Terms of Service</h1>
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
              {section.uppercase && (
                <p className={styles.paragraphUppercase}>{section.uppercase}</p>
              )}

              {section.listPrefix && (
                <p className={styles.paragraphWithList}>{section.listPrefix}</p>
              )}

              {section.content && (
                <p className={`${styles.paragraph} ${section.list ? styles.paragraphWithList : ''}`}>
                  {section.content}
                </p>
              )}

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
                    <strong>Address:</strong> Your business address
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className={styles.closingStatement}>
          <p className={styles.closingText}>
            By using PlacePin, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;