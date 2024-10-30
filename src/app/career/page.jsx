import PostCard from '@/components/PostCard';
import Services, { Article } from '@/components/Services'
import ExperienceDropdown from '@/components/ui/searchbar'
import React from 'react'

const page = () => {
    const contentData = [
        {
            id: 1,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 2,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 3,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 4,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 5,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 6,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 7,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
        {
            id: 8,
            title: "How to Get a Good Salary?",
            duration: "30 minutes",
            portions: 4,
            description: "Learn practical tips to boost your salary with confidence.",
            date: "Oct 20, 12:45PM",
            views: 1347,
            comments: 12,
        },
    ];

    return (
        <>
            <div className='bg-gray-300 w-full flex items-center justify-center py-10'>
                <div className='w-full max-w-6xl flex gap-5 '>
                    <ExperienceDropdown />
                </div>
            </div>
            <div className='w-full flex items-center bg-[#eeeeee] justify-center py-10'>
                <div className='w-full max-w-6xl flex gap-5 '>
                    <Services />
                </div>
            </div>
            <div className='w-full flex items-center bg-[#eeeeee] justify-center'>
                <Article />

            </div>
            <div className='w-full gap-5 items-center justify-center py-10 h-full flex flex-wrap'>
                {contentData.map((item) => (
                    <PostCard
                        key={item.id}
                        title={item.title}
                        duration={item.duration}
                        portions={item.portions}
                        description={item.description}
                        date={item.date}
                        views={item.views}
                        comments={item.comments}
                    />
                ))}
            </div>
        </>
    )
}

export default page