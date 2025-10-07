import { Mail, Phone, MessageCircle, Instagram } from 'lucide-react';
import logo from "../assets/header/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex flex-row items-center justify-between space-x-2">
          {/* Logo */}
          <div className="flex-shrink-0 flex-1">
            <img src={logo} alt="Valley Rose" className=" ml-30" />
          </div>
          
          <div className="flex-2 text-gray-300 px-15 ">
            Welcome to Valley Rose Hotel, a cozy and charming 3-star hotel nestled in Vienna's 22nd district. We offer a peaceful retreat with easy access to the heart of the city. Our goal is to make every guest feel at home. Whether you're visiting for business or a relaxing getaway, we provide comfortable rooms, delicious home-cooked meals, and friendly service in a calm, welcoming atmosphere.
          </div>

          <div className="flex flex-col flex-1">
            <h4 className="font-semibold   mb-2">Quick Links</h4>
            <ul className="space-x-2 flex flex-row text-gray-300  ">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Hotel</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Restaurant</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
            </ul>

            <div className="flex gap-2 mt-2">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-2 pt-2 text-center">
          <p className="text-gray-400 text-xs">© 2022-2025 by ValleyRose.com, Inc.</p>
        </div>
      </div>
    </footer>
  );
}