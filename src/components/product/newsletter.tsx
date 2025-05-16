import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <section className="bg-black text-white py-8 px-6 rounded-xl mx-auto my-12 max-w-[90%]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <h3 className="text-2xl font-bold leading-tight mb-6 md:mb-0">
          STAY UPTO DATE ABOUT
          <br />
          OUR LATEST OFFERS
        </h3>

        <form className="w-full max-w-md space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              placeholder="Enter your email address"
              className="pl-10 h-12 rounded-full bg-white text-black"
              required
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-full bg-white text-black hover:bg-gray-100">
            <span className="font-bold">Subscribe to Newsletter</span>
          </Button>
        </form>
      </div>
    </section>
  )
}
