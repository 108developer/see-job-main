import Image from 'next/image'
import React from 'react'
import InfiniteCarousel from './Slider'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Check, Search } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export const HeroSection = () => {
    return (<>
        <div className='relative w-full text-center items-center justify-center flex '>
            <Image className='w-full h-[400px]' width={1200} height={100} src='https://seejob.netlify.app/images/top-img.png' alt='HeroSection' />
            <div className='  w-full h-full bg-white/70 bg-opacity-95 text-white gap-5 absolute flex items-center justify-center'>
                <div className='max-w-6xl  w-full h-full text-white gap-5 absolute flex items-center justify-center'>
                    <div className='text-start w-full'>
                        <div className='text-black text-3xl font-semibold'>What</div>
                        <div className='text-black'>Are you looking for?</div>
                        <div className='flex'>
                            <div className=' bg-gray-400 p-2 rounded-l-sm'><Search /></div>
                            <input type="text" placeholder='Job title Keyowrds or company' className='px-4 py-2 rounded-r-sm w-full' />
                        </div>
                    </div>
                    <div className='text-start w-full'>
                        <div className='text-black text-3xl font-semibold'>What</div>
                        <div className='text-black'>Are you looking for?</div>
                        <div className='flex'>
                            <div className=' bg-gray-400 p-2 rounded-l-sm'><Search /></div>
                            <input type="text" placeholder='Job title Keyowrds or company' className='px-4 py-2 rounded-r-sm w-full' />
                        </div>
                    </div>
                    <div className='h-[100px] flex items-end'>
                        <button className='bg-red-500 h-fit truncate py-2 px-4'>Find Jobs</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export const JobCategory = () => {
    return (
        <div className='text-center mx-auto py-10 flex flex-col gap-5 w-full'>
            <div className='font-bold text-xl '>
                Job Category
            </div>
            <div className='flex flex-wrap items-center justify-center '>
                <div className='text-center w-[200px] flex flex-col border border-gray-50 items-center justify-center py-10 hover:bg-blue-200'>
                    <Image className='h-10 w-fit' src='https://seejob.netlify.app/images/icon-accounting.png' alt='first' width={100} height={100} />
                    <div className=''>
                        Accounting
                    </div>
                </div>
                <div className='text-center w-[200px] flex flex-col border border-gray-50 items-center justify-center py-10 hover:bg-blue-200'>
                    <Image className='h-10 w-fit' src='https://seejob.netlify.app/images/icon-development.png' alt='first' width={100} height={100} />
                    <div className=''>
                        Development
                    </div>
                </div>
                <div className='text-center w-[200px] flex flex-col border border-gray-50 items-center justify-center py-10 hover:bg-blue-200'>
                    <Image className='h-10 w-fit' src='https://seejob.netlify.app/images/icon-technical.png' alt='first' width={100} height={100} />
                    <div className=''>
                        Technical
                    </div>
                </div>
                <div className='text-center w-[200px] flex flex-col border border-gray-50 items-center justify-center py-10 hover:bg-blue-200'>
                    <Image className='h-10 w-fit' src='https://seejob.netlify.app/images/icon-news.png' alt='first' width={100} height={100} />
                    <div className=''>
                        Media News
                    </div>
                </div>
                <div className='text-center w-[200px] flex flex-col border border-gray-50 items-center justify-center py-10 hover:bg-blue-200'>
                    <Image className='h-10 w-fit' src='https://seejob.netlify.app/images/icon-medical.png' alt='first' width={100} height={100} />
                    <div className=''>
                        Medical
                    </div>
                </div>
                <div className='text-center w-[200px] flex flex-col border border-gray-50 items-center justify-center py-10 hover:bg-blue-200'>
                    <Image className='h-10 w-fit' src='https://seejob.netlify.app/images/icon-govt.png' alt='first' width={100} height={100} />
                    <div className=''>
                        Computer Jobs
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Sliding = () => {
    const logos = [
        'https://seejob.netlify.app/images/icon-accounting.png',
        'https://seejob.netlify.app/images/icon-accounting.png',
        'https://seejob.netlify.app/images/icon-accounting.png',
        'https://seejob.netlify.app/images/icon-accounting.png',
        'https://seejob.netlify.app/images/icon-accounting.png',
        'https://seejob.netlify.app/images/icon-accounting.png',
        'https://seejob.netlify.app/images/icon-accounting.png',
    ];
    return <div className=' flex flex-col bg-[#f8f9fa] py-10 items-center justify-center w-full'>
        <div className='font-semibold text-2xl'>Hiring Companies</div>
        <InfiniteCarousel />
    </div>
}

export const ResumeService = () => {
    return (
        <div className="flex flex-col gap-5 items-center justify-center p-6">
            <div className='text-2xl font-semibold'>Resume Service</div>
            <div className="flex gap-5 max-w-5xl">
                {[...Array(3)].map((_, index) => (
                    <Card key={index} className={`p-6  rounded-none hover:shadow-xl transition-shadow rounded-md ${index == 1 ? "bg-red-400 text-white" : ""}`}>
                        <CardHeader className="flex flex-row items-center gap-2 mb-4">
                            <Check className="text-green-500" />
                            <CardTitle className="text-lg font-semibold">Career Booster Resume</CardTitle>
                        </CardHeader>
                        <CardDescription className={`mb-4 text-sm ${index == 1 ? "text-white" : ""}`}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                        </CardDescription>
                        <a href="/" className={`${index == 1 ? "text-white" : "text-blue-600"} hover:underline text-sm font-medium`}>
                            Read More
                        </a>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const FAQ = () => {
    const faqData = [
        {
            question: "Do i Need to pay for apply a job or interview",
            answer:
                "No. You can apply for Free on seejob. The Genuine recuiters do not ask for the money. In case you will receive a call so, call us immidiately",
        },
        {
            question: "How Can i Update My profile",
            answer:
                "you can register on see job after that go to your profile section and fill the information.",
        },
        {
            question: "Why SeeJob is Different From Others",
            answer:
                "Seejob is providing free online services to employee and employer. The employee can post a free job with all the benefits while the employer searches the job according to their skill without pay anything.",
        },
        {
            question: "Do Employers also get charged for hiring ?",
            answer:
                "Yes, we offer international shipping to selected countries. Shipping fees and delivery times will vary depending on the destination.",
        },
        {
            question: "Does it cost to create a profile on SeeJob ?",
            answer:
                "Whether you are an employee or an employer, you don't have to give an extra penny for creating your profile.",
        },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
                {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-lg  text-red-400 font-medium text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};
