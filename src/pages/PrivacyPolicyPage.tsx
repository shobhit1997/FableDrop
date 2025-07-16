import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C2A1E] via-[#5D4037] to-[#2C3E50]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 backdrop-blur-sm border-b border-[#F4A261]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B4513] via-[#F4A261] to-[#2C3E50] rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
                  📚
                </div>
                <h1 className="text-xl font-serif font-bold text-[#2C3E50]">
                  FableDrop
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-sm text-[#8B4513] hover:text-[#A0522D] transition-colors font-serif"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-serif font-bold text-[#F6F1EB] mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#F6F1EB]/90 font-serif italic">
            Your privacy is as important to us as a well-crafted story
          </p>
          <div className="mt-4 text-sm text-[#F4A261] font-serif">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Introduction
            </h2>
            <p className="text-[#2C3E50] font-serif leading-relaxed">
              Welcome to FableDrop ("we," "our," or "us"). We are committed to
              protecting your personal information and your right to privacy.
              This Privacy Policy explains how we collect, use, and share
              information about you when you use our book subscription service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  📧 Account Information
                </h3>
                <p className="text-[#2C3E50] font-serif leading-relaxed">
                  When you create an account, we collect your name, email
                  address, and profile picture through Google OAuth
                  authentication.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  📖 Reading Preferences
                </h3>
                <p className="text-[#2C3E50] font-serif leading-relaxed">
                  We collect information about your book preferences, reading
                  history, and the books you choose through our service to
                  personalize your experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  📍 Delivery Information
                </h3>
                <p className="text-[#2C3E50] font-serif leading-relaxed">
                  We collect shipping addresses and delivery preferences to
                  ensure your chosen books reach you safely.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  💻 Usage Data
                </h3>
                <p className="text-[#2C3E50] font-serif leading-relaxed">
                  We automatically collect information about how you use our
                  service, including search queries, page views, and interaction
                  patterns.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              How We Use Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F4A261]/10 rounded-lg p-4">
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  📚 Service Delivery
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  To process your book selections, manage your subscription, and
                  deliver your chosen books.
                </p>
              </div>

              <div className="bg-[#F4A261]/10 rounded-lg p-4">
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  ✨ Personalization
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  To improve our book recommendations and enhance your reading
                  experience.
                </p>
              </div>

              <div className="bg-[#F4A261]/10 rounded-lg p-4">
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  📬 Communication
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  To send you order confirmations, shipping updates, and
                  important account information.
                </p>
              </div>

              <div className="bg-[#F4A261]/10 rounded-lg p-4">
                <h3 className="text-lg font-serif font-semibold text-[#8B4513] mb-2">
                  🔧 Improvement
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  To analyze usage patterns and improve our service quality and
                  user experience.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Information Sharing
            </h2>
            <div className="bg-[#F4A261]/10 rounded-lg p-6">
              <p className="text-[#2C3E50] font-serif leading-relaxed mb-4">
                <strong>
                  We do not sell, trade, or rent your personal information to
                  third parties.
                </strong>{" "}
                We may share your information only in the following limited
                circumstances:
              </p>
              <ul className="space-y-2 text-[#2C3E50] font-serif">
                <li>
                  • <strong>Service Providers:</strong> With trusted partners
                  who help us deliver books and process payments
                </li>
                <li>
                  • <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and safety
                </li>
                <li>
                  • <strong>Business Transfers:</strong> In the event of a
                  merger or acquisition (with your consent)
                </li>
                <li>
                  • <strong>With Your Consent:</strong> When you explicitly
                  agree to share your information
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Data Security
            </h2>
            <p className="text-[#2C3E50] font-serif leading-relaxed mb-4">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. These measures
              include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-serif font-semibold text-[#8B4513] mb-1">
                  Encryption
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  Data encrypted in transit and at rest
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-serif font-semibold text-[#8B4513] mb-1">
                  Access Control
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  Limited access on need-to-know basis
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-serif font-semibold text-[#8B4513] mb-1">
                  Monitoring
                </h3>
                <p className="text-sm text-[#2C3E50] font-serif">
                  Regular security audits and monitoring
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Your Rights
            </h2>
            <div className="bg-[#F4A261]/10 rounded-lg p-6">
              <p className="text-[#2C3E50] font-serif leading-relaxed mb-4">
                You have the following rights regarding your personal
                information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-[#2C3E50] font-serif">
                  <li>
                    • <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    • <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    • <strong>Deletion:</strong> Request deletion of your
                    personal data
                  </li>
                </ul>
                <ul className="space-y-2 text-[#2C3E50] font-serif">
                  <li>
                    • <strong>Portability:</strong> Export your data in a
                    standard format
                  </li>
                  <li>
                    • <strong>Objection:</strong> Object to certain data
                    processing
                  </li>
                  <li>
                    • <strong>Restriction:</strong> Limit how we process your
                    data
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Cookies and Local Storage
            </h2>
            <p className="text-[#2C3E50] font-serif leading-relaxed">
              We use local storage and browser cookies to enhance your
              experience, remember your preferences, and maintain your session.
              You can control these through your browser settings, though
              disabling them may affect service functionality.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Contact Us
            </h2>
            <div className="bg-[#F4A261]/10 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📮</div>
              <p className="text-[#2C3E50] font-serif leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or how we
                handle your personal information, please don't hesitate to reach
                out to us.
              </p>
              <div className="space-y-2 text-[#2C3E50] font-serif">
                <p>
                  <strong>Email:</strong> privacy@fabledrop.com
                </p>
                <p>
                  <strong>Address:</strong> FableDrop Privacy Team, 123 Literary
                  Lane, Booktown, BT 12345
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F4A261]/30 pb-2">
              Policy Updates
            </h2>
            <p className="text-[#2C3E50] font-serif leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the "Last updated" date. We
              encourage you to review this Privacy Policy periodically.
            </p>
          </section>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            📚 Back to Top
          </button>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
