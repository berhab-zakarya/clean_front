import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    
    <div className="inline-block">
      <Link href="/" className="block">
        <Image 
          src={"/assets/images/logo.svg"}
          height={56}
          width={150}
          priority
          className='h-auto w-auto'
          alt='Algecom'/>
      </Link>
    </div>
  )
}

export default Logo