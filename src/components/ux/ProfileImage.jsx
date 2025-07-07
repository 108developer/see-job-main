// components/ProfileImage.js
import { useState } from "react";

export default function ProfileImage({ src, alt }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setIsZoomed(true)}
        style={{ width: "100px", cursor: "pointer", borderRadius: "50%" }}
      />

      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 10px white",
            }}
          />
        </div>
      )}
    </>
  );
}
