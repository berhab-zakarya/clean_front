import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
    <Image src={"/assets/images/logo.svg"} height={56} width={158} alt='Algecom'/>
    </div>
  )
}

export default Logo