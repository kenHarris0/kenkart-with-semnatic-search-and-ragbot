import Chatbot from "@/components/Chatbot";
import Products from "./products/page";


export default function Home() {
  return (
    <div className="w-full h-full ">
      <Products/>

      <Chatbot/>
      
    </div>
  );
}
