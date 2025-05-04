import Image from "next/image";

const Capabilities = () => {
  return (
    <section className="pt-32 bg-[#F9FAFB]">
      <div className="container mx-auto px-4">
        <h2 className="text-sm font-bold text-[#1E3A8A] uppercase mb-2 tracking-wider">
          OUR CAPABILITIES
        </h2>
        <h3 className="text-4xl font-bold text-[#1E3A8A] mb-12">
          We can help you with...
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:translate-x-2 hover:translate-y-2 hover:bg-orange-500">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#1E3A8A] rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-white">
                <Image
                  src="/assets/icons/empty-wallet-time.svg"
                  alt="Clear payment history"
                  width={24}
                  height={24}
                  className="transition-colors duration-300"
                />
              </div>
            </div>
            <div>
              <h4 className="group-hover:text-white text-xl font-semibold text-[#1E3A8A] mb-2">
              Automatic Invoice Payment
              </h4>
              <p className="text-gray-600 text-sm">
              Automatic payments help you to arrange payments on a certain date
              without doing it again.
              </p>
            </div>
          </div>


          {/* Card 2 */}
          <div className="group flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:translate-x-2 hover:translate-y-2 hover:bg-orange-500">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#1E3A8A] rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-white">
                <Image
                  src="/assets/icons/document-text.svg"
                  alt="Clear payment history"
                  width={24}
                  height={24}
                  className="transition-colors duration-300"
                />
              </div>
            </div>
            <div>
              <h4 className="group-hover:text-white text-xl font-semibold text-[#1E3A8A] mb-2">
                Clear payment history
              </h4>
              <p className="text-gray-600 text-sm">
                Clear payment history helps you to track your business expenses on
                specific dates.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:translate-x-2 hover:translate-y-2 hover:bg-orange-500">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#1E3A8A] rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-white">
                <Image
                  src="/assets/icons/cards.svg"
                  alt="Use of multi-card payments"
                  width={24}
                  height={24}
                  className="transition-colors duration-300"
                />
              </div>
            </div>
            <div>
              <h4 className="group-hover:text-white text-xl font-semibold text-[#1E3A8A] mb-2">
                Use of multi-card payments
              </h4>
              <p className="text-gray-600 text-sm">
                Have more than one debit or credit card? we support payments using
                more than one card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;