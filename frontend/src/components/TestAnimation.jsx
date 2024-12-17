import { FaGithub } from 'react-icons/fa';

export default function TestAnimation() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
        <FaGithub className="text-6xl text-teal-400 hover:text-teal-600" />
        <span className="text-lg text-teal-400 hover:text-teal-600">Test</span>
      </div>
    </div>
  );
}
