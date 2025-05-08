import type React from "react"
import Logo from "@/components/common/Logo"

interface HeaderProps {
    className?: string
}

const Header: React.FC<HeaderProps> = ({className = ""}) => {
    return (
        <header className={`w-full bg-white border-b border-gray-100 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <Logo />
                </div>
            </div>
        </header>
    )
}

export default Header