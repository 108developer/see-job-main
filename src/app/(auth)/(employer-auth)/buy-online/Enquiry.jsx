import React from "react";
import { Home, Mail, Phone, MessageCircle, Smartphone } from "lucide-react";

const contactInfo = [
  {
    label: "Email",
    value: "example@domain.com",
    icon: <Mail className="text-gray-600" />,
    link: "mailto:example@domain.com",
  },
  {
    label: "Call",
    value: "+1234567890",
    icon: <Phone className="text-gray-600" />,
    link: "tel:+1234567890",
  },
  {
    label: "WhatsApp",
    value: "+1234567890",
    icon: <MessageCircle className="text-gray-600" />,
    link: "https://wa.me/1234567890",
  },
  {
    label: "Phone",
    value: "+1234567890",
    icon: <Smartphone className="text-gray-600" />,
  },
];

const Enquiry = () => {
  return (
    <div className="mx-auto py-8 bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-semibold items-start flex w-full px-8">
          Enquiry
        </h2>
        <p className="mt-4 text-gray-500">Feel free to reach out to us!</p>
      </div>

      {/* Contact information */}
      <div className="mt-8 flex flex-wrap justify-center space-x-8">
        {contactInfo.map((contact, index) => (
          <div key={index} className="flex items-center">
            <span className="text-lg mr-2">{contact.icon}</span>
            <span className="font-semibold text-gray-700">
              {contact.label}:
            </span>
            {contact.link ? (
              <a
                href={contact.link}
                className="ml-2 text-blue-500 hover:underline"
              >
                {contact.value}
              </a>
            ) : (
              <span className="ml-2 text-gray-600">{contact.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Enquiry;
