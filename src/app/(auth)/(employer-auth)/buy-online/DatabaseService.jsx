import Enquiry from "./Enquiry";

const services = [
  {
    title: "Starter",
    bgColour: "#8c8c8c",
    price: "Rs 500",
    validity: "15 Days",
    profiles: "60 Candidate Profile",
  },
  {
    title: "Basic",
    bgColour: "#4b8f29",
    price: "Rs 900",
    validity: "30 Days",
    profiles: "200 Candidate Profile",
  },
  {
    title: "Corporate",
    bgColour: "#007bff",
    price: "Rs 1500",
    validity: "60 Days",
    profiles: "400 Candidate Profile",
  },
  {
    title: "Corporate Plus",
    bgColour: "#d84f4f",
    price: "Rs 3000",
    validity: "60 Days",
    profiles: "1000 Candidate Profile",
  },
  {
    title: "Premium",
    bgColour: "#f8b400",
    price: "Rs 4000",
    validity: "120 Days",
    profiles: "4000 Candidate Profile",
  },
];

const DatabaseService = () => {
  return (
    <div className="mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg flex flex-col gap-4 w-full"
          >
            <div
              className="text-lg font-semibold text-white w-full text-center py-2"
              style={{ backgroundColor: service.bgColour }}
            >
              {service.title}
            </div>
            <div className="flex flex-col items-center justify-center flex-grow p-4">
              <p className="text-lg font-semibold mt-2 text-gray-600">
                {service.price} / PM
              </p>
              <p className="mt-2 text-sm text-gray-400">{service.profiles}</p>
              <p className="mt-2 text-sm text-gray-400">
                {service.validity} validity
              </p>
            </div>
            <div className="px-4 py-2 mt-auto mb-4 mx-auto   bg-red-500 text-white text-center rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer">
              Buy Now
            </div>
          </div>
        ))}
      </div>

      {/* Custom Package offer */}
      <div className="text-center mt-8">
        <p className="text-lg text-blue-500">
          Ask for your Own Customize Package
        </p>
      </div>

      <Enquiry />
    </div>
  );
};

export default DatabaseService;
