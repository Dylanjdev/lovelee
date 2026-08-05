import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <>
      <section className="page-hero page-hero--legal">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Your Information</p>
          <h1 className="page-hero__headline">Privacy Policy</h1>
          <p className="page-hero__lede">Last updated: July 14, 2026</p>
        </div>
      </section>

      <section className="legal-page">
        <div className="legal-page__inner">
          <aside className="legal-page__summary" aria-label="Policy summary">
            <p className="section-label">At a Glance</p>
            <p>
              We collect information you choose to send us so we can respond to
              messages, discuss custom work, and manage directory submissions.
            </p>
            <p>We do not sell or rent your personal information.</p>
          </aside>

          <div className="legal-page__content">
            <section>
              <h2>1. About This Policy</h2>
              <p>
                This Privacy Policy explains how LoveLeeVa (&ldquo;LoveLeeVa,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects,
                uses, shares, and protects information when you visit loveleeva.com,
                contact us, request custom work, or interact with our business directory.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <h3>Information you provide</h3>
              <p>Depending on how you use the site, you may provide:</p>
              <ul>
                <li>Your name, email address, phone number, and message.</li>
                <li>Custom-order details such as product type, engraving text, dimensions, quantity, deadline, or design preferences.</li>
                <li>Business-directory information such as a business name, location, category, service description, contact information, and website or social-page link.</li>
                <li>Other information you choose to include in a form or communication.</li>
              </ul>
              <h3>Information collected automatically</h3>
              <p>
                Our hosting and form-service providers may automatically receive
                standard technical information such as your IP address, browser type,
                device type, referring page, and access time for security, delivery,
                troubleshooting, and service operation.
              </p>
              <h3>Google Analytics 4 and cookies</h3>
              <p>
                We use Google Analytics 4 (&ldquo;GA4&rdquo;) to understand how
                visitors find and use the website. When enabled, GA4 may collect page
                views, interactions, session statistics, approximate location, browser
                and device information, and traffic-source information. GA4 generally
                uses first-party cookies, including a cookie named <code>_ga</code>, to
                distinguish browsers and sessions. Google states that GA4 uses IP
                addresses during collection to derive approximate location and then
                discards them before the data is logged.
              </p>
              <p>
                We use this information to measure site performance and improve content
                and navigation—not to identify you by name. You can limit cookies through
                your browser settings or use the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  Google Analytics Opt-out Browser Add-on
                </a>. Google&rsquo;s handling of analytics information is described in its{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>.
              </p>
            </section>

            <section>
              <h2>3. How We Use Information</h2>
              <p>We may use information to:</p>
              <ul>
                <li>Respond to questions and communicate with you.</li>
                <li>Review custom-order requests, prepare quotes, and coordinate requested work.</li>
                <li>Review, verify, publish, update, or remove business-directory listings.</li>
                <li>Measure website traffic, understand feature usage, and improve site content and navigation.</li>
                <li>Operate, maintain, secure, and improve the website.</li>
                <li>Prevent misuse and comply with legal obligations.</li>
              </ul>
              <p>
                Information submitted for a directory listing is intended for public
                display after review. Please submit only business information you are
                authorized and comfortable to have published.
              </p>
            </section>

            <section>
              <h2>4. How We Share Information</h2>
              <p>We may share information in these limited circumstances:</p>
              <ul>
                <li>
                  <strong>Service providers.</strong> Our contact and custom-order forms
                  are processed by Formspree. Form submissions and related technical
                  information are handled under the{' '}
                  <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                    Formspree Privacy Policy
                  </a>. We may also use Google Analytics and providers that help host,
                  maintain, secure, or support the website.
                </li>
                <li><strong>Public directory.</strong> Approved business information may be published in the directory as requested by the submitter.</li>
                <li><strong>Legal and safety reasons.</strong> We may disclose information when reasonably necessary to comply with law, protect rights or safety, investigate misuse, or respond to lawful requests.</li>
                <li><strong>Business changes.</strong> Information may be transferred as part of a merger, reorganization, financing, sale, or transfer of all or part of the project, subject to applicable law.</li>
              </ul>
              <p>We do not sell or rent personal information, and we do not use it for targeted advertising.</p>
            </section>

            <section>
              <h2>5. Data Retention and Security</h2>
              <p>
                We retain information only as long as reasonably needed for the purposes
                described above, to maintain appropriate business records, resolve
                disputes, and meet legal obligations. Retention periods vary based on
                the type of request and our relationship with you.
              </p>
              <p>
                We use current, industry-standard administrative and technical
                safeguards designed to protect the information we handle against
                unauthorized access, loss, misuse, alteration, and disclosure. We review
                and improve these protections as technology and security risks evolve.
                However, no method of online transmission or storage is completely
                secure, so we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2>6. Your Choices and Privacy Rights</h2>
              <p>
                You may ask us to access, correct, or delete information you submitted,
                or to remove or update a directory listing. Depending on where you live
                and whether applicable legal requirements are met, you may also have
                rights to obtain a portable copy of your data, opt out of certain
                processing, or appeal a decision about a privacy request.
              </p>
              <p>
                Submit a request through our <Link to="/contact/">Contact page</Link> and
                include enough detail for us to identify the relevant information. We
                may need to verify your identity or authority. To appeal a denied request,
                submit another message labeled &ldquo;Privacy Appeal&rdquo; and explain your concern.
              </p>
            </section>

            <section>
              <h2>7. Third-Party Links</h2>
              <p>
                The site may link to social platforms, business websites, and other
                third-party services. Their privacy practices are governed by their own
                policies, and we are not responsible for their content or practices.
              </p>
            </section>

            <section>
              <h2>8. Children&rsquo;s Privacy</h2>
              <p>
                This website is not directed to children under 13, and we do not
                knowingly collect personal information from children under 13. If you
                believe a child has provided information, please contact us so we can
                review and delete it where appropriate.
              </p>
            </section>

            <section>
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this policy as the website and our practices change. The
                revised version will be posted here with a new &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                Questions or privacy requests can be sent through our{' '}
                <Link to="/contact/">Contact page</Link> or by calling{' '}
                <a href="tel:2762991475">(276) 299-1475</a>. LoveLeeVa is based in
                Jonesville, Virginia, United States.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
