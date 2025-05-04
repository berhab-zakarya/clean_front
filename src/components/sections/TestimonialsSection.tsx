"use client"
import Image from "next/image"
import ThreeColumnTestimonials from "../ui/three-column-testimonials"
import { motion } from "framer-motion"

const testimonialData = [
  {
    name: "Sarah Johnson",
    handle: "sarahj",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This product completely transformed our workflow. Highly recommend to anyone looking to improve efficiency!",
  },
  {
    name: "Michael Chen",
    handle: "mchen",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "I've tried many similar solutions, but this one stands out. The interface is intuitive and the support team is amazing.",
  },
  {
    name: "Jessica Williams",
    handle: "jwilliams",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "Game changer for our team! We've seen a 40% increase in productivity since implementing this solution.",
  },
  {
    name: "David Rodriguez",
    handle: "drodriguez",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "The best investment we've made this year. The ROI has been incredible and our clients are happier than ever.",
  },
  {
    name: "Emma Thompson",
    handle: "ethompson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "Absolutely love the simplicity and power of this tool. It's become an essential part of our daily operations.",
  },
  {
    name: "James Wilson",
    handle: "jwilson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "If you're on the fence about trying this, just do it. You won't regret it. It's been a complete game-changer for us.",
  },
  {
    name: "Alex Rivera",
    handle: "arivera",
    image: "/placeholder.svg?height=100&width=100",
    description: "The customer service is exceptional. They went above and beyond to help us implement the solution.",
  },
  {
    name: "Olivia Parker",
    handle: "oparker",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "We've cut our processing time in half since using this tool. The analytics features are particularly useful.",
  },
  {
    name: "Daniel Kim",
    handle: "dkim",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "As a small business owner, I was hesitant about the cost, but it's been worth every penny. Highly recommend!",
  },
  {
    name: "Sophia Martinez",
    handle: "smartinez",
    image: "/placeholder.svg?height=100&width=100",
    description: "The integration with our existing systems was seamless. Our team was up and running in no time.",
  },
  {
    name: "Ryan Taylor",
    handle: "rtaylor",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "I appreciate how responsive the development team is to feedback. They're constantly improving the product.",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
  {
    name: "Ava Johnson",
    handle: "ajohnson",
    image: "/placeholder.svg?height=100&width=100",
    description:
      "This has streamlined our entire process. What used to take days now takes hours. Incredible time-saver!",
  },
]

 const TestimonialSection = () =>{
  return (
    <main className="relative container mx-auto flex min-h-screen flex-col  justify-center">
         <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col gap-6 justify-start">
            <h2 className="text-[20px] font-normal text-[#2D2E83]">
              TESTIMONIAL
            </h2>
            <div className="flex items-center justify-between">
              <h3 className="text-[40px] font-bold text-[#2D2E83] text-left">
                Our happy
                <br />
                customer say
              </h3>
              <p className="text-gray-500 mt-4 max-w-2xl text-left text-[20px] font-sans">
              Every one of us loves something different. So explore the world through the lens of our visual capabilities, and find what you love 
              </p>
            </div>
          </div>
        </motion.div>
        <Image
  className="absolute top-0 left-0 -z-10 object-cover"
  src="/assets/images/bg-testimonials.png"
  fill
  alt="Testimonials background"
/>

      <ThreeColumnTestimonials data={testimonialData} />
    </main>
  )
}
export default TestimonialSection