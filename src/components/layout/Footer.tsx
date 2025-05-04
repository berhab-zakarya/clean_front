"use client"

import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 block">
              <Image 
              src="/assets/images/logo.svg" 
              alt="Algecom Logo" 
              width={149} 
              height={30} 
              priority
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Data visualization, and expense management for your business.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#1E3A8A] text-[20px]">
              Product
            </h4>
            <ul className="space-y-9">
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  Digital Invoice
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                 Insights
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
              Reimbursements
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                 Virtual Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                Artificial Intelligence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#1E3A8A] text-[20px]">
              Company
            </h4>
            <ul className="space-y-9">
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-gray-600 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-gray-600 hover:text-gray-900"
                >
               Newsletters
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-gray-600 hover:text-gray-900"
                >
                  Our Partners
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                 Career
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
               Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#1E3A8A] text-[20px]">
              Resources
            </h4>
            <ul className="space-y-9">
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                Events
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                Ebook & Guide
                </Link>
              </li>
            </ul>
          </div>

          <div className="justify-between">
            <h4 className="font-bold mb-4 text-[#1E3A8A] text-[20px]">
              Follow Us
            </h4>
            <ul className="space-y-9">
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  Instagram
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[16px] text-[#828282] hover:text-gray-900"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link
              href="#"
              className="text-[#1E3A8A] text-[20px] font-bold hover:text-gray-900"
            >
              Privacy Policy
            </Link>

            <span className="text-[#1E3A8A] text-[20px] font-normal">|</span>

            <Link
              href="#"
              className="text-[#1E3A8A] text-[20px] font-bold hover:text-gray-900"
            >
              Terms & Conditions
            </Link>

            <span className="text-[#1E3A8A] text-[20px] font-normal">|</span>

            <Link
              href="#"
              className="text-[#1E3A8A] text-[20px] font-bold hover:text-gray-900"
            >
              Cookie Policy
            </Link>
          </div>
          <div className="text-[16px] text-[#828282]">© Algecom 2025</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
