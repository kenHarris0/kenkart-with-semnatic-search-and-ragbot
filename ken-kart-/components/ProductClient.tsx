'use client'

import { Field, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

import Link from 'next/link'
import { IProduct } from '@/models/types'
import { useState } from 'react'



const ProductClient = ({products}:{products:IProduct[]}) => {

    const [search,setsearch]=useState<string>("")

    const filtereditems=products.filter((item)=>item.name.trim().toLowerCase().startsWith(search))

  return (
    <>
     <div className="mb-10">
    <Field className="max-w-lg">
      <FieldTitle>Search Products</FieldTitle>
      <Input
        placeholder="Search..."
        className="rounded-lg"
        value={search}
        onChange={(e)=>setsearch(e.target.value)}
      />
    </Field>
  </div>

  {/* Products */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {filtereditems?.map((item) => (
      <Link href={`/products/${item._id}`} key={item._id}>
        <Card
          
          className="overflow-hidden hover:shadow-lg  cursor-pointer hover:scale-110 transition-transform duration-400 ease-in-out"
          
        >
        <CardContent className="p-4 ">
          <div className="relative w-full h-48">
            <Image
              src={item.image[0]}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>

          <h3 className="mt-4 font-semibold text-lg">
            {item.name}
          </h3>

          <p className="text-muted-foreground">
            ${item.price}
          </p>
        </CardContent>
      </Card>
      </Link>
    ))}
  </div>
      
    </>
  )
}

export default ProductClient
