import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatWidget } from "@/components/dashboard/faq/chat-widget"
import { faqMail, faqCard, faqSlash, faqTruck, faqDollarSign, faqTag } from "@/lib/icons"
import Image from "next/image"

export default function FAQPage() {
  return (
    <div className="w-full bg-white">
      {/* Main Content - No sidebar or header */}
      <main className="w-full">
        {/* Blue header section */}
        <div className="bg-[#1e3a8a] p-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h6 className="text-white mb-2">FAQs</h6>
              <h1 className="text-4xl font-bold text-white mb-4">Ask us anything</h1>
              <p className="text-white">Have any questions? We&apos;re here to assist you.</p>
            </div>

            <div className="relative w-full max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search something here"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full text-sm bg-white"
              />
            </div>
          </div>
        </div>

        {/* White content section */}
        <div className="bg-white p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center mb-4">
                  <Image src={faqMail} alt="Mail icon" width={20} height={20} className="text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">How do I change my account email?</h3>
                <p className="text-sm text-gray-600">
                  You can log in to your account and change it from your Profile {">"} Edit Profile. Then go to the
                  general tab to change your email.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center mb-4">
                  <Image src={faqCard} alt="Card icon" width={20} height={20} className="text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">What should I do if my payment fails?</h3>
                <p className="text-sm text-gray-600">
                  If your payment fails, you can use the (COD) payment option, if available on that order. If your
                  payment is debited from your account after a payment failure, it will be credited back within 7-10
                  days.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center mb-4">
                  <Image src={faqSlash} alt="Slash icon" width={20} height={20} className="text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">What is your cancellation policy?</h3>
                <p className="text-sm text-gray-600">
                  You can now cancel an order when it is in packed/shipped status. Any amount paid will be credited into
                  the same payment mode using which the payment was made.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center mb-4">
                  <Image src={faqTruck} alt="Truck icon" width={20} height={20} className="text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">How do I check order delivery status?</h3>
                <p className="text-sm text-gray-600">
                  Please tap on &quot;My Orders&quot; section under main menu of App/Website/M-site to check your order status.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center mb-4">
                  <Image src={faqDollarSign} alt="Dollar sign icon" width={20} height={20} className="text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">What is Instant Refunds?</h3>
                <p className="text-sm text-gray-600">
                  Upon successful pickup of the return product at your doorstep, ALGECOM will instantly initiate the
                  refund to your source account or chosen method of refund. Instant Refunds is not available in a few
                  select pin codes and for all self ship returns.
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center mb-4">
                  <Image src={faqTag} alt="Tag icon" width={20} height={20} className="text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">How do I apply a coupon on my order?</h3>
                <p className="text-sm text-gray-600">
                  You can apply a coupon on cart page before order placement. The complete list of your unused and valid
                  coupons will be available under &quot;My Coupons&quot; tab of App/Website/M-site.
                </p>
              </div>
            </div>

            {/* Still have questions section */}
            <div className="mt-12 bg-[#f97316] rounded-2xl p-6 flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-xl font-medium mb-2">Still have questions?</h3>
                <p>Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
              </div>
              <Button className="bg-white text-[#f97316] hover:bg-gray-100 whitespace-nowrap">Get in touch</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget as a separate component */}
      <ChatWidget />
    </div>
  )
}
