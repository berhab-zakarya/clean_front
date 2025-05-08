import Image from 'next/image'
import React from 'react'

const LogoWhite = () => {
  return (
    <div>
    <Image src={"/logo/svg/logo_white.svg"} height={56} width={158} alt='Algecom'/>
    </div>
  )
}

export default LogoWhite