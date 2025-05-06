import Link from 'next/link';
import diamond from '@/app/images/diamond-removebg-preview.png'
import Image from 'next/image';
export default function Navbar() {
  return (
    <nav className="bg-ff-dark text-ff-light p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-ff-primary text-2xl font-bold font-ff-main">
          Free Diamonds FF
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-ff-dark border border-ff-primary rounded px-3 py-1">
            <Image src={diamond} alt="Diamonds" className="h-6 w-6 mr-2"/>
            <span className="font-bold text-ff-accent">5,000</span>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-ff-primary transition">Home</Link>
            <Link href="/store" className="hover:text-ff-primary transition">Store</Link>
            <Link href="/offers" className="hover:text-ff-primary transition">Offers</Link>
            <Link href="/tasks" className="hover:text-ff-primary transition">Tasks</Link>
            <Link href="/profile" className="hover:text-ff-primary transition">Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}