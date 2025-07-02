"use client";

import { Loader } from "@/components/ui/loader";
import { useGetContactDataQuery } from "@/redux/api/admin";
import { setModal } from "@/redux/slices/modalSlice";
import * as Icons from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const contactFields = [
  { name: "address", label: "Address", icon: "MapPin" },
  { name: "email", label: "Email", icon: "Mail", linkPrefix: "mailto:" },
  {
    name: "contact",
    label: "Contact Number",
    icon: "Phone",
    linkPrefix: "tel:",
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    icon: "MessageCircle",
    customLink: (value) =>
      `https://api.whatsapp.com/send?phone=${value}&text=Hello%20I%20am%20looking%20for%20enquiry%20regarding`,
  },
  { name: "facebook", label: "Facebook", icon: "Facebook", isFullUrl: true },
  { name: "instagram", label: "Instagram", icon: "Instagram", isFullUrl: true },
];

const Contact = () => {
  const { useremail } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetContactDataQuery();
  const dispatch = useDispatch();

  const openContactModal = () => {
    dispatch(
      setModal({
        modalType: "ContactModalForm",
        modalProps: { data },
      })
    );
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center justify-center w-full">
          Contact Us
        </h1>
        {useremail === "admin@example.com" && (
          <button
            onClick={openContactModal}
            className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full gap-8 p-4">
          <Loader count={5} height={50} className="mb-4" />
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load contact data</p>
      ) : data ? (
        <ul className="space-y-4">
          {contactFields.map(
            ({ name, label, icon, linkPrefix, isFullUrl, customLink }) => {
              const IconComponent = Icons[icon];
              const value = data[name];

              return (
                <li key={name} className="flex flex-col md:flex-row space-x-2">
                  <div className="flex gap-2 items-center">
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="font-semibold">{label}:</span>
                  </div>
                  {value ? (
                    <span>
                      {linkPrefix || isFullUrl || customLink ? (
                        <a
                          href={
                            customLink
                              ? customLink(value)
                              : isFullUrl
                              ? value
                              : `${linkPrefix}${value}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </span>
                  ) : (
                    <span>Not Available</span>
                  )}
                </li>
              );
            }
          )}
        </ul>
      ) : (
        <p>No contact info found.</p>
      )}
    </div>
  );
};

export default Contact;
