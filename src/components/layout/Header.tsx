"use client"
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../common/Logo';
import Button from '../common/Button';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="container mx-auto flex items-center justify-between h-[84px] mt-4 ">
      <div className="flex items-center cursor-pointer">
        <Logo />
      </div>
      
      <nav className="flex justify-between items-center  gap-32 mx-auto bg-white rounded-full shadow-sm">
        <Link 
          href="/" 
          className={`flex justify-center items-center px-8 py-2 h-14 ${pathname === '/' ? 'bg-[#1E3A8A] rounded-full text-white' : 'text-[#1E3A8A]'} font-medium text-lg transition-colors`}
        >
          Home
        </Link>
        <Link 
          href="#about" 
          className="text-[#1E3A8A] pl-2 font-medium text-lg hover:text-[#1E3A8A] transition-colors"
        >
          About us
        </Link>
        <Link 
          href="#services" 
          className="text-[#1E3A8A] font-medium text-lg hover:text-[#1E3A8A] transition-colors"
        >
          Services
        </Link>
        <Link 
          href="#pricing" 
          className="text-[#1E3A8A] font-medium text-lg hover:text-[#1E3A8A]-600 transition-colors"
        >
          Pricing
        </Link>
        <Link 
          href="#contact" 
          className="text-[#1E3A8A] pr-8 font-medium text-lg hover:text-[#1E3A8A] transition-colors"
        >
          Contact us
        </Link>
      </nav>
      
      <Button 
        className="px-8" 
        onClick={() => {
          router.push('/login');
        }}
      >
        Get started
      </Button>
    </header>
  );
};

export default Header;