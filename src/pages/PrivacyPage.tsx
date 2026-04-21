import { Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const sections = [
  {
    title: 'Personal identification information',
    body: 'We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, credit card information. Users may, however, visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.',
  },
  {
    title: 'Non-personal identification information',
    body: 'We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.',
  },
  {
    title: 'Web browser cookies',
    body: 'Our Site may use "cookies" to enhance User experience. User\'s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.',
  },
  {
    title: 'How we use collected information',
    body: 'Our website may collect and use Users personal information for the following purposes:\n\n\u2022 To improve customer service \u2014 information you provide helps us respond to your customer service requests and support needs more efficiently.\n\u2022 To personalize user experience \u2014 we may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.\n\u2022 To improve our Site \u2014 we may use feedback you provide to improve our products and services.\n\u2022 To process payments \u2014 we may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.\n\u2022 To run a promotion, contest, survey or other Site feature \u2014 to send Users information they agreed to receive about topics we think will be of interest to them.\n\u2022 To send periodic emails \u2014 we may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.',
  },
  {
    title: 'How we protect your information',
    body: 'We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.',
  },
  {
    title: 'Sharing your personal information',
    body: 'We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above. We may use third party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.',
  },
  {
    title: 'Third party websites',
    body: 'Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website\'s own terms and policies.',
  },
  {
    title: 'Changes to this privacy policy',
    body: 'DesignActiv has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.',
  },
  {
    title: 'Your acceptance of these terms',
    body: 'By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.',
  },
  {
    title: 'Google Data Usage',
    body: 'This software posts videos you create with the app to your YouTube account at your request, as such it is authenticated with YouTube and we store your token in our database. This information is not shared with any other third parties, and you can revoke access at any time within your Google account (https://security.google.com/settings/security/permissions). For information on how Google uses data obtained via YouTube API, see https://policies.google.com/privacy',
  },
  {
    title: 'Minors',
    body: 'We do not knowingly collect information from individuals under eighteen (18) years of age, or persons who are otherwise covered by the provisions of the Children\'s Online Privacy Protection Act of 1998, as amended ("COPPA"). No information should be submitted to, or posted at, the Website by individuals under eighteen (18) years of age. We encourage parents and guardians to spend time online with their children and to participate and monitor the interactive activities of their children.',
  },
  {
    title: 'Viewing, Use and/or Communication is Construed as Acceptance',
    body: 'Acceptance of the terms of this Privacy Policy is a portion of the consideration required for your right to visit the Website. If you do not accept the terms of this Privacy Policy in their entirety, you have no right to visit the Website.',
  },
  {
    title: 'Information Obtained from Electronic Means and Cookies',
    body: 'We may collect certain non-personally identifiable information about you when you visit many of the sections of the Website. This non-personally identifiable information includes, without limitation, the type of browser that you use, your IP address, the type of operating system that you use and the domain name of your Internet service provider. We use the non-personally identifiable information that we collect to improve the design and content of the Website and to enable us to personalize your Internet experience. We also may use this information in the aggregate to analyze Website usage, as well as to offer you products and services. We also reserve the right to use aggregate or group data about our Visitors for any and all lawful purposes.',
  },
  {
    title: 'Data Security',
    body: 'All collected information is stored in a technically and physically secure environment. When our registration/application process asks users to enter sensitive information (such as credit card number), and when we store and transmit such sensitive information, it is encrypted and protected with SSL encryption software. While we use SSL encryption to protect sensitive information online, we also do everything in our power to protect sensitive information and other personal information off-line. Unfortunately, no data transmission over the Internet, or otherwise, can be guaranteed to be 100% secure. As a result, while we strive to protect your sensitive information and other personal information, we cannot ensure or warrant the security of any information that you transmit to us, and you do so at your own risk.',
  },
  {
    title: 'GDPR Compliance Information',
    body: 'We here at DesignActiv are meeting the new requirements for how we process EU personal data. We embrace these changes, and our policy updates reflect the transparency that this new law requires.\n\nDesignActiv is GDPR compliant so that our clients can use shared marketing services automation with ease.\n\nAt DesignActiv we take data confidentiality seriously and meet data privacy regulations, and support organizations that use shared marketing services while meeting data privacy requirements across the globe.',
  },
  {
    title: 'Opt-Out',
    body: 'Any individual has the right to opt-out of email communication from us at any point of time without any prior information. Each email sent by DesignActiv contains a link that allows the individual to permanently opt-out of receiving emails from us. Additionally, the email management allows the individual to manage the type of communication they receive from DesignActiv via subscription management.\n\nIf you want your data to be removed permanently from our system, you can contact us by emailing us at support@designactiv.com. Along with your request, please provide your EU citizenship proof to get your information deleted permanently.',
  },
  {
    title: '3rd Party Disclosure',
    body: 'Personal details, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without the consent of the customer, other than for the express purpose of delivering the purchased product or service requested by the customer.',
  },
];

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0a1e] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2 mb-4">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">{t('privacy.badge')}</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">{t('privacy.title')}</h1>
          <p className="text-gray-400">Last updated: April 15, 2026</p>
        </div>

        <div className="card-dark rounded-2xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed">
            This Privacy Policy governs the manner in which DesignActiv collects, uses, maintains and discloses information collected from DesignActiv users (each, a "User"). This privacy policy applies to the Site and all products and services offered by DesignActiv.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="card-dark rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">{section.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="card-dark rounded-2xl p-6 mt-6">
          <h3 className="text-white font-bold text-lg mb-3">Contacting Us</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us using{' '}
            <span className="text-brand-400 font-semibold">contact@designactiv.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
