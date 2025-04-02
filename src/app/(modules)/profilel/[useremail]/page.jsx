// app/profile/[useremail]/page.jsx
import { useGetProfileQuery } from "@/redux/services/profileApi";
import { useState } from "react";
import ProfileModal from "./ProfileModal"; // Modal component with Formik form
import { Edit } from "lucide-react"; // Pencil icon from Lucide React

export default function ProfilePage({ params }) {
  const { useremail } = params;
  const {
    data: profileData,
    isLoading,
    isError,
  } = useGetProfileQuery(useremail);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true); // Open the modal when the pencil icon is clicked
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching profile data.</div>;

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Displaying profile for: {useremail}</p>

      {/* Displaying profile data */}
      <div>
        <strong>Username:</strong> {profileData.username}
      </div>
      <div>
        <strong>Email:</strong> {profileData.email}
      </div>
      <div>
        <strong>Phone:</strong> {profileData.phone}
      </div>
      <div>
        <strong>Location:</strong> {profileData.location}
      </div>

      {/* Pencil Icon to trigger modal */}
      <Edit size={24} onClick={handleEditClick} style={{ cursor: "pointer" }} />

      {/* Profile Update Modal */}
      {isModalOpen && (
        <ProfileModal
          profileData={profileData}
          useremail={useremail}
          onClose={() => setIsModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
}

// export default async function ProfilePage({ params }) {
//     const { useremail } = await params;

//     return (
//       <div>
//         <h1>Profile Page</h1>
//         <p>Displaying profile for: {useremail}</p>
//       </div>
//     );
// }
