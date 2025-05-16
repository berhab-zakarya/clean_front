import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">ZJ.CO</h4>
            <p className="text-sm">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">COMPANY</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-gray-900">About</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Features</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Works</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Career</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">HELP</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-gray-900">Customer Support</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Delivery Details</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">FAQ</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-gray-900">Account</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Manage Deliveries</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Orders</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Payments</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">RESOURCES</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-gray-900">Free eBooks</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Development Tutorial</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">How to - Blog</Link></li>
              <li><Link href="#" className="text-sm hover:text-gray-900">Youtube Playlist</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">ZJ.co ©2025, All Rights Reserved</p>
          </div>
          <div className="flex space-x-4">
            <img 
              src="https://cdn-icons-png.flaticon.com/128/5968/5968341.png" 
              alt="Visa" 
              className="w-8 h-8 object-contain"
            />
            <img 
              src="https://cdn-icons-png.flaticon.com/128/5968/5968144.png" 
              alt="Mastercard" 
              className="w-8 h-8 object-contain"
            />
            <img 
              src="https://cdn-icons-png.flaticon.com/128/196/196565.png" 
              alt="PayPal" 
              className="w-8 h-8 object-contain"
            />
            <img 
              src="https://cdn-icons-png.flaticon.com/128/888/888870.png" 
              alt="Apple Pay" 
              className="w-8 h-8 object-contain"
            />
            <img 
              src="https://cdn-icons-png.flaticon.com/128/6124/6124998.png" 
              alt="Google Pay" 
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}