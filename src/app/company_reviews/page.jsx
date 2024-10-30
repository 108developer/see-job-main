import ReviewCard from '@/components/ui/Review'
import React from 'react'

const page = () => {
    const reviews = [
        { name: "Ekta Sharma", date: "Aug 2", role: "Web designer", isVerified: true, review: "Excellent service and great solutions." },
        { name: "John Doe", date: "Sep 15", role: "Backend Developer", isVerified: false, review: "Helped me find my dream job quickly." },
        { name: "John Doe", date: "Sep 15", role: "Backend Developer", isVerified: false, review: "Helped me find my dream job quickly." },
        { name: "John Doe", date: "Sep 15", role: "Backend Developer", isVerified: false, review: "Helped me find my dream job quickly." },
        { name: "John Doe", date: "Sep 15", role: "Backend Developer", isVerified: false, review: "Helped me find my dream job quickly." },
        { name: "John Doe", date: "Sep 15", role: "Backend Developer", isVerified: false, review: "Helped me find my dream job quickly." },
        { name: "John Doe", date: "Sep 15", role: "Backend Developer", isVerified: false, review: "Helped me find my dream job quickly." },
        // ... more reviews
    ]
    return (
        <div className='w-full flex items-center justify-center py-10'>
            <div className='w-full flex-col max-w-5xl flex gap-5 '>
                {reviews.map((review, index) => (
                    <ReviewCard key={index} index={index} {...review} />
                ))}
            </div>
        </div>
    )
}

export default page