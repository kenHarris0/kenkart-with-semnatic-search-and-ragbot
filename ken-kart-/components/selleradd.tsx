'use client'





import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import React, { useRef, useState } from 'react'
import { Button } from "./ui/button"
import { Field, FieldGroup } from "./ui/field"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { File } from "lucide-react"
import AddsellerProduct from "@/lib/actions/addsellerproduct"
import { useRouter } from "next/navigation"
import RemovesellerProduct from "@/lib/actions/removesellerproduct"
import { IProduct } from "@/models/types"

interface IForm{
     name:string,
        description:string,
        price:number,
        offerPrice:number,
        category:string
}

const Selleradd = ({allProducts,role}:{allProducts:IProduct[],role:string}) => {
const router=useRouter()
    const fileref=useRef<HTMLInputElement>(null)
    const [image,setimage]=useState<string | null>("")
    const [formdata,setformdata]=useState<IForm>({
        name:"",
        description:"",
        price:0,
        offerPrice:0,
        category:""
    })

    function Changehandler(e:React.ChangeEvent<  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
           
        const {name,value}=e.target;

        setformdata(prev=>({...prev,[name]:(name==="price" || name==="offerPrice") ? Number(value):value}))
    }


    function filechangehandler(){

    }

    function handleFilechange(e:React.ChangeEvent<HTMLInputElement>){
        const file=e.target.files?.[0]
        if(!file){
            return
        }
        const reader=new FileReader()

        reader.onloadend=()=>{
            const base64img=reader.result as string
            setimage(base64img)
        }
        reader.readAsDataURL(file)
    }

const handleSumbit=async(e:React.FormEvent)=>{
    e.preventDefault()
    const fdata=new FormData()

    fdata.set('name',formdata.name)
     fdata.set('description',formdata.description)
      fdata.set('price',formdata.price.toString())
       fdata.set('offerPrice',formdata.offerPrice.toString())
        fdata.set('category',formdata.category)

        if(image){
            fdata.set("image",image)
        }
setformdata({
     name:"",
        description:"",
        price:0,
        offerPrice:0,
        category:""
})
setimage("")
        const res=await AddsellerProduct(fdata);
        if(res.success){
            alert("product added")
            router.refresh()
        }

}

const removeitem=async(id:string)=>{
try{
    const res=await RemovesellerProduct(id)
    if(res.success){
        alert('product removed successfully')
        router.refresh()
    }

}
catch(err){
    console.log(err)
}
}



  return (
    <>
     <h1 className="text-xl font-semibold tracking-tight">{role==="admin" ?"Admin" :" Seller"} Dashboard</h1>

         {role==="seller"  &&  <div className="w-full h-30 border-b p-4">
                 <Dialog>
        <DialogTrigger asChild>
            <Button>List Product</Button>
        </DialogTrigger>
        <DialogContent>
         <form onSubmit={handleSumbit}>
     
           
                <FieldGroup>
                    
                    <Field>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" name="name" value={formdata.name} onChange={Changehandler}/>
                    </Field>

                     <Field>
                        <Label htmlFor="description">Description</Label>
                        <Textarea  id="description" name="description" rows={3} value={formdata.description} onChange={Changehandler}/>
                    </Field>

                    <Field>
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" id="price" name="price" value={formdata.price} onChange={Changehandler}/>
                    </Field>

                    <Field>
                        <Label htmlFor="offerPrice">Offer Price</Label>
                        <Input  type="number" id="offerPrice" name="offerPrice" value={formdata.offerPrice} onChange={Changehandler}/>
                    </Field>

                    <Field>
                        <Label htmlFor="category">Category</Label>
                        <Input  type="text" id="category" name="category" value={formdata.category} onChange={Changehandler}/>
                    </Field>

                    <Field>
                        <Label>
                            <File onClick={()=>fileref.current?.click()} className="cursor-pointer"/>
                        </Label>
                        <Input type="file" ref={fileref} name="image" id="image" className="hidden" onChange={handleFilechange}/>
                    </Field>













                </FieldGroup>
               
            
        
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
        </DialogFooter>
         </form>
</DialogContent>
    </Dialog>
                
            </div>}

            <div className="grid grid-cols-3 gap-2 w-full h-300 overflow-y-auto  p-5">
                {allProducts?.map((item:IProduct,ind:number)=>{
                    return(
                        
                        
                        <div
  key={item._id?.toString() ?? ind}
  className="border h-fit p-5 rounded-xl  shadow-sm hover:shadow-md transition bg-white flex flex-col gap-3"
>
  <img
    src={item.image[0]}
    alt={item.name}
    className="w-100 h-80 object-cover rounded-lg "
  />

  <div className="flex flex-col gap-1">
    <h2 className="text-lg font-semibold">{item.name}</h2>

    <p className="text-sm text-gray-600 line-clamp-2">
      {item.description}
    </p>

    <span className="text-sm text-blue-600 font-medium">
      {item.category}
    </span>

    <div className="flex items-center gap-3 mt-2">
      <span className="text-xl font-bold text-green-600">
        ${item.offerPrice}
      </span>

      <span className="text-gray-400 line-through">
        ${item.price}
      </span>

     
    </div>
     <Button variant="destructive" className="" onClick={()=>removeitem(item._id!)}>Remove</Button>
  </div>
</div>
                    )
                })}

            </div>




   </>
  )
}

export default Selleradd
