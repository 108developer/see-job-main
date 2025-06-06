import { Mail, MessageCircle, Phone, Smartphone } from "lucide-react";

const contactInfo = [
  {
    label: "Email",
    value: "seejob.in@gmail.com",
    icon: <Mail className="text-gray-600" />,
    link: "mailto:seejob.in@gmail.com",
  },
  {
    label: "Call",
    value: "+919958841077",
    icon: <Phone className="text-gray-600" />,
    link: "tel:+919958841077",
  },
  {
    label: "WhatsApp",
    value: "+919958841077",
    icon: <MessageCircle className="text-gray-600" />,
    link: "https://api.whatsapp.com/send?phone=919958841077&text=Hello%20I%20am%20looking%20for%20enquiry%20regarding",
  },
  {
    label: "Phone",
    value: "+919958841077",
    icon: <Smartphone className="text-gray-600" />,
  },
];

const Enquiry = () => {
  return (
    <div className="mx-auto py-8 bg-white px-2">
      <div className="text-center">
        <h2 className="text-2xl font-semibold items-start flex w-full px-8">
          Enquiry
        </h2>
        <p className="mt-4 text-gray-500">Feel free to reach out to us!</p>
      </div>

      {/* Contact information */}
      <div className="mt-8 flex flex-wrap justify-start md:justify-center gap-x-6 gap-y-4 p-4 rounded-md">
        {contactInfo.map((contact, index) => (
          <div
            key={index}
            className="flex items-start sm:items-center w-full sm:w-1/2 md:w-auto p-3 rounded"
          >
            <span className="text-lg mr-2">{contact.icon}</span>
            <span className="font-semibold text-gray-700 mr-1">
              {contact.label}:
            </span>
            {contact.link ? (
              <a
                href={contact.link}
                className="text-blue-500 hover:underline break-words"
              >
                {contact.value}
              </a>
            ) : (
              <span className="text-gray-600 break-words">{contact.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Enquiry;
