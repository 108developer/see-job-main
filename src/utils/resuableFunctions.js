export function formatDateOnly(dateString, locale = 'en-IN') {
    if (!dateString) return "N/A"; // Return "N/A" if dateString is undefined or null
    const date = new Date(dateString); // Parse the ISO date string to a Date object
    // Check if the date is valid
    if (isNaN(date)) {
        return "Invalid Date"; // Return a default message if the date is invalid
    }
    // Options to format as DD/MM/YYYY
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    // Format the date
    return new Intl.DateTimeFormat(locale, options).format(date);
}