
'use client'
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import Checkicon from '@/assets/check.png'
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Success(){
    const router=useRouter()
    return(
        <div className="w-full h-screen flex items-center justify-center font-bold text-2xl gap-2 bg-green-200">

            <Card className=' w-100 h-100 bg-green-400/70'>
                <CardContent className=' h-full flex flex-col items-center p-5 gap-5 justify-start'>
                    <Image src={Checkicon} alt="x" width={100} height={100}/>

                    <h1 className='text-xl'>Payment successful</h1>
                 <p className='text-sm mt-5 text-muted-foreground '>Your payment has been successful processed.Now you can go to the home page and browse more cool stuffs</p>
                </CardContent>
                <CardFooter>
                    <Button className='w-full' onClick={()=>router.push('/')}>Continue Shopping</Button>
                </CardFooter>
            </Card>
          
            
        </div>
    )
}