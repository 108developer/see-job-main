import { Bookmark, Pin, Star } from 'lucide-react';
import Image from 'next/image'
import React from 'react'

const Services = () => {
    const adviceData = [
        { id: 1, image: 'https://seejob.netlify.app/images/covid-19.png', alt: 'img1', title: 'Covid-19 Career Advice' },
        { id: 2, image: 'https://seejob.netlify.app/images/tax.png', alt: 'img2', title: 'Taxation & Service Advice' },
        { id: 3, image: 'https://seejob.netlify.app/images/cv.png', alt: 'img3', title: 'Resume Services' },
        { id: 4, image: 'https://seejob.netlify.app/images/shuttle.png', alt: 'img4', title: 'Start Ups' },
        { id: 5, image: 'https://seejob.netlify.app/images/meeting.png', alt: 'img5', title: 'Interview Tips' },
        { id: 6, image: 'https://seejob.netlify.app/images/woman.png', alt: 'img6', title: 'Woman Career Advice' },
        { id: 7, image: 'https://seejob.netlify.app/images/covid-19.png', alt: 'img1', title: 'Covid-19 Career Advice' },
        { id: 8, image: 'https://seejob.netlify.app/images/tax.png', alt: 'img2', title: 'Taxation & Service Advice' },
        { id: 9, image: 'https://seejob.netlify.app/images/cv.png', alt: 'img3', title: 'Resume Services' },
        { id: 10, image: 'https://seejob.netlify.app/images/shuttle.png', alt: 'img4', title: 'Start Ups' },
        { id: 11, image: 'https://seejob.netlify.app/images/meeting.png', alt: 'img5', title: 'Interview Tips' },
        { id: 12, image: 'https://seejob.netlify.app/images/woman.png', alt: 'img6', title: 'Woman Career Advice' },
    ];

    return (
        <div className='flex items-center justify-between'>
            <div className='w-full flex-wrap text-center flex'>
                {adviceData.map((item) => (
                    <div key={item.id} className='p-4 border hover:bg-transparent/5 border-gray-800 flex flex-col items-center justify-center w-[140px]'>
                        <Image src={item.image} alt={item.alt} width={100} height={100} className='h-12 w-12' />
                        {item.title}
                    </div>
                ))}
            </div>
            <div className='w-[20%]'><Trending /></div>
        </div>
    )
}

export default Services


export const Trending = () => {
    return <div className=' flex flex-col text-base p-4 bg-white py-10 w-[200px] h-full border rounded-sm'>
        <div className='text-red-500 text-lg flex gap-2'><Pin />Trending articles</div>
        <div className='flex items-start gap-2'><Star className=' text-[#990033]' fill='#990033' />10 most Common interview Questions</div>
        <div className='flex items-start gap-2'><Star className=' text-[#990033]' fill='#990033' />10 most Common interview Questions</div>
        <div className='flex items-start gap-2'><Star className=' text-[#990033]' fill='#990033' />10 most Common interview Questions</div>
    </div>
}

export const Article = () => {
    return (
        <div className='w-full'>
            <div className='bg-[#990033] text-2xl font-bold text-white   w-full py-10 text-center'>Latest Career Article</div>
        </div>
    )
}