import photo from "../assets/images/photo.jpg";
import { SignupFormDemo } from "../components/LoginForm"; // Ensure correct import
import logo from "../assets/images/logo.jpg";

const LoginPage = () => {
  return (
    <div className='h-screen max-w-full flex flex-col md:flex-row items-center justify-between bg-[#1a211e] relative'>
      {/* Logo and text positioned absolutely at the top left */}
      <div className="absolute top-[30px] left-[99px] lg:flex items-center hidden space-x-2">
        <img src={logo} className="h-10 w-10 rounded-lg" alt="Logo" />
        <span className="text-white text-xl font-bold">GreenFuture</span>
      </div>
      
      <SignupFormDemo /> {/* Render the signup form */}
      
      <img src={photo} alt="Decorative" className="hidden md:block h-full object-cover w-[33%]" />
    </div>
  );
}

export default LoginPage;
