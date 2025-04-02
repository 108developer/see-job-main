// // app/profile/[useremail]/clientPage.jsx

// "use client";

// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// export default function ProfileClientSide() {
//   const [isMounted, setIsMounted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return <p>Loading...</p>; // Show loading until the component is mounted

//   const { useremail } = router.query;

//   if (!useremail) return <p>Profile not found</p>;

//   return (
//     <div>
//       <h1>Profile Page (Client-Side)</h1>
//       <p>Displaying profile for: {useremail}</p>
//     </div>
//   );
// }
