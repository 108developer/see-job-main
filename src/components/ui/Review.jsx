import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReviewCard({
    index,
    name,
    date,
    role,
    isVerified,
    review
}) {
    const isRightAligned = index % 2 === 0; // Right-aligned for even index, left-aligned for odd

    return (
        <Card
            className={`w-full max-w-3xl shadow-sm hover:shadow-lg hover:shadow-black/40 transition-shadow duration-300 ${isRightAligned ? 'mr-auto ' : 'ml-auto'
                }`}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-sm text-muted-foreground">{date}</p>
                    </div>
                </div>
                <p className="text-sm text-blue-600 font-medium mb-1">{role}</p>
                {isVerified && (
                    <Badge variant="secondary" className="mb-2">
                        Verified Person
                    </Badge>
                )}
                <p className="text-sm">{review}</p>
            </CardContent>
        </Card>
    )
}
