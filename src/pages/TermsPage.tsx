import { FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const sections = [
  {
    number: '1',
    title: 'Acceptance of Terms',
    body: 'By accessing or using the DesignActiv platform ("DesignActiv," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the platform.',
  },
  {
    number: '2',
    title: 'Use of the Platform',
    body: 'DesignActiv provides tools for creating digital designs. You may use the platform only in compliance with these Terms and all applicable laws and regulations.',
  },
  {
    number: '3',
    title: 'Ownership and License of Designs',
    body: 'All designs created using DesignActiv may be used for both personal and commercial purposes. Subject to your compliance with these Terms, DesignActiv grants you a non-exclusive, royalty-free license to use, reproduce, and display designs you create using the platform.\n\nYou are responsible for ensuring that your use of any designs complies with applicable laws and does not infringe the rights of third parties.',
  },
  {
    number: '4',
    title: 'Platform Restrictions',
    body: 'You may not:\n\n\u2022 Redistribute, resell, sublicense, or make available the DesignActiv platform itself to any third party;\n\u2022 Reverse engineer, copy, or attempt to extract the source code or underlying systems of the platform;\n\u2022 Use the platform in a way that interferes with or disrupts its operation.',
  },
  {
    number: '5',
    title: 'Intellectual Property',
    body: 'All rights, title, and interest in and to the DesignActiv platform, including software, features, and branding, remain the exclusive property of DesignActiv. These Terms do not grant you ownership of the platform.',
  },
  {
    number: '6',
    title: 'Modifications to the Service or Terms',
    body: 'We reserve the right to modify or discontinue the platform, or to update these Terms, at any time. Continued use of DesignActiv after changes are made constitutes acceptance of the revised Terms.',
  },
  {
    number: '7',
    title: 'Disclaimer of Warranties',
    body: 'The platform is provided on an "as is" and "as available" basis, without warranties of any kind, express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.',
  },
  {
    number: '8',
    title: 'Limitation of Liability',
    body: 'To the maximum extent permitted by law, DesignActiv shall not be liable for any indirect, incidental, consequential, or special damages arising out of or related to your use of the platform.',
  },
  {
    number: '9',
    title: 'Termination',
    body: 'We may suspend or terminate your access to DesignActiv at any time if you violate these Terms or use the platform in a manner that we deem harmful or unlawful.',
  },
  {
    number: '10',
    title: 'Governing Law',
    body: 'These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.',
  },
  {
    number: '11',
    title: 'Contact Information',
    body: 'If you have any questions about these Terms, please contact us through the DesignActiv platform.',
  },
];

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0a1e] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-4">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="text-brand-400 text-sm font-semibold">{t('terms.title')}</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">{t('terms.title')}</h1>
          <p className="text-gray-400">Last updated: April 15, 2026</p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.number} className="card-dark rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">
                <span className="text-brand-400 mr-2">{section.number}.</span>
                {section.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
