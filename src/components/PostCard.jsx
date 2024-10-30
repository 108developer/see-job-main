import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Eye, MessageSquare } from "lucide-react"

export default function PostCard({
    title,
    duration,
    portions,
    description,
    date,
    views,
    comments
}) {
    return (
        <Card className="w-full max-w-[300px] h-[300px]">
            <CardHeader>
                <h3 className="text-xl font-semibold text-red-500">{title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                    <span>•</span>
                    <span>{portions} portions</span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <Button variant="destructive" size="sm">
                    Read More
                </Button>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <span>{date}</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{comments}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}