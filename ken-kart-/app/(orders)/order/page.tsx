import { connectDB } from "@/lib/db"
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
import Order from "@/models/order.model";
import { IOrder, IProduct } from "@/models/types";







export default async function OrderPage(){

    await connectDB();

const { userId } = await auth();

if (!userId) {
  return <div>Unauthorized</div>;
}

const user = await User.findOne({ clerkId: userId });

if (!user) {
  return <div>User not found</div>;
}


type popualtedType=Omit<IOrder,"products"> & {
    products:{
        product:IProduct,
        quantity:number

    }[]
}


const orders = await Order.find({
  user: user._id,
}).populate("products.product") as popualtedType[]






    return(
   <div className="max-w-5xl mx-auto py-8 space-y-6">
  <h1 className="text-3xl font-bold">
    {user?.name}'s Orders
  </h1>

  {orders.length === 0 ? (
    <div className="border rounded-lg p-8 text-center text-gray-500">
      No orders yet.
    </div>
  ) : (
    orders.map((order: popualtedType) => (
      <div
        key={order._id!.toString()}
        className="border rounded-xl p-6 shadow-sm space-y-5"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-semibold">
              Order #{order._id!.toString().slice(-6)}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(order.createdAt!).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {order.orderStatus}
            </p>

            <p className="text-green-600 text-sm">
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Products */}

        <div className="space-y-4">
          {order.products.map((item: {product:IProduct,quantity:number}) => (
            <div
              key={item.product._id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image[0]}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                  <h2 className="font-medium">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-500">
                    Qty : {item.quantity}
                  </p>
                </div>
              </div>

              <p className="font-semibold">
                ₹{item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Shipping Address
            </p>

            <p>{order.shippingAddress}</p>
          </div>

          <div className="text-right">
            <p className="font-bold text-xl">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      </div>
    ))
  )}
</div>)
}