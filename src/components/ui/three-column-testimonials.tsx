import Marquee from "../animata/container/marquee"

interface Testimonial {
  name: string
  handle: string
  image: string
  description: string
}

interface TestimonialProps {
  data: Testimonial[]
}

interface Testimonial {
  image: string;
  name: string;
  handle: string;
  description: string;
}

function TestimonialCard({
  testimonial: { image, name, handle, description },
}: {
  testimonial: Testimonial
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-4 w-full">
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
          {image && <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />}
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-600">@{handle}</p>
        </div>
      </div>
    </div>
  )
}

export default function ThreeColumnTestimonials({ data }: TestimonialProps) {
  // Distribute testimonials evenly across three columns
  const itemsPerColumn = Math.ceil(data.length / 3)
  const column1Data = data.slice(0, itemsPerColumn)
  const column2Data = data.slice(itemsPerColumn, itemsPerColumn * 2)
  const column3Data = data.slice(itemsPerColumn * 2, data.length)

  // Duplicate data for seamless looping in marquee
  const column1Loop = [...column1Data, ...column1Data]
  const column2Loop = [...column2Data, ...column2Data]
  const column3Loop = [...column3Data, ...column3Data]

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {/* First column - bottom to top */}
      <div className="h-[600px] overflow-hidden">
        <Marquee vertical className="[--duration:15s]" pauseOnHover applyMask={true}>
          {column1Loop.map((testimonial, index) => (
            <TestimonialCard key={`col1-${testimonial.name}-${index}`} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>

      {/* Second column - top to bottom */}
      <div className="h-[600px] overflow-hidden transform scale-y-[-1]">
  <Marquee vertical className="[--duration:15s]" pauseOnHover applyMask={true}>
    {column2Loop.map((testimonial, index) => (
      <div className="transform scale-y-[-1]">
        <TestimonialCard key={`col2-${testimonial.name}-${index}`} testimonial={testimonial} />
      </div>
    ))}
  </Marquee>
</div>


      {/* Third column - bottom to top */}
      <div className="h-[600px] overflow-hidden">
        <Marquee vertical className="[--duration:15s]" pauseOnHover applyMask={true}>
          {column3Loop.map((testimonial, index) => (
            <TestimonialCard key={`col3-${testimonial.name}-${index}`} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </div>
  )
}