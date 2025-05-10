export const handleDownloadResume = async (resumeUrl, fullName, email) => {
  try {
    if (!resumeUrl || typeof resumeUrl !== "string") {
      // throw new Error("Invalid or missing resume URL.");
      console.warn("Resume URL missing or invalid");
      alert("Resume is not available.");
      return;
    }

    const response = await fetch(resumeUrl);

    if (!response.ok) {
      // throw new Error("Failed to fetch resume file.");
      console.warn("Failed to fetch resume file.");
      alert("Resume is not available.");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    const filename = `${fullName || "Candidate"}_${email || "NoEmail"}.pdf`;
    link.href = url;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Resume could not be downloaded. Please try again.");
  }
};
