"use client"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Card, CardHeader } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Eye, } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'



const ChannalCard = ({ channel }: any) => {
    const { data: session } = useSession()
    return (<>

        {!session ? (
            <Card className='w-96'>
                <CardHeader className='flex items-center'>
                    <Avatar className='w-10 h-10'>
                        <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                        <AvatarImage src={channel.profile} />
                    </Avatar>
                    <div className="">
                        <h1 className="font-bold">{channel.name}</h1>
                        <p className='-mt-2 text-sm font-[500]'>{channel.followers.length} follower</p>
                    </div>
                    <div className="ml-auto">
                        <Link href={`/channels/${channel._id}`}>
                            <Button size={'sm'} className='rounded-full'>Veiw <Eye /></Button>
                        </Link>
                    </div>
                </CardHeader>
                <Separator className='-mt-3' />
                <div className="mx-2">
                    <h1 className='font-bold text-sm text-neutral-700'>Description</h1>
                    <Textarea className='border-none' placeholder={channel.description} disabled />
                </div>
                <div className='flex mx-2 gap-2 items-center'>
                    <h1 className='font-bold text-sm text-neutral-700'>Owner</h1>
                    <Avatar>
                        <AvatarFallback>{channel.owner.name.charAt(0)}</AvatarFallback>
                        <AvatarImage src={channel.owner.profile} />
                    </Avatar>
                    <div className="">
                        <h1 className="font-bold">{channel.owner.name}</h1>
                    </div>
                </div>
            </Card>

        ) : (
            session?.user?.email == channel.owner.email ?
                (<>

                </>
                ) :
                (
                    <Card className='w-96'>
                        <CardHeader className='flex items-center'>
                            <Avatar className='w-10 h-10'>
                                <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                                <AvatarImage src={channel.profile} />
                            </Avatar>
                            <div className="">
                                <h1 className="font-bold">{channel.name}</h1>
                                <p className='-mt-2 text-sm font-[500]'>{channel.followers.length} follower</p>
                            </div>
                            <div className="ml-auto">
                                <Link href={`/channels/${channel._id}`}>
                                    <Button size={'sm'} className='rounded-full'>Veiw <Eye /></Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <Separator className='-mt-3' />
                        <div className="mx-2">
                            <h1 className='font-bold text-sm text-neutral-700'>Description</h1>
                            <Textarea className='border-none' placeholder={channel.description} disabled />
                        </div>
                        <div className='flex mx-2 gap-2 items-center'>
                            <h1 className='font-bold text-sm text-neutral-700'>Owner</h1>
                            <Avatar>
                                <AvatarFallback>{channel.owner.name.charAt(0)}</AvatarFallback>
                                <AvatarImage src={channel.owner.profile} />
                            </Avatar>
                            <div className="">
                                <h1 className="font-bold">{channel.owner.name}</h1>
                            </div>
                        </div>
                    </Card>
                ))
        }
    </>
    )
}

export default ChannalCard