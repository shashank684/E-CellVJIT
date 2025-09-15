import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <div className="h-screen bg-black">
      <Navigation />
      <div className="pt-32 px-4 text-white">
        <h1 className="text-4xl font-bold mb-4">E-CELL VJIT</h1>
        <p className="text-xl text-gray-400">Where Ideas Take Off</p>
        <div className="mt-16">
          <p className="text-gray-300">Scroll down to see the navigation bar transform...</p>
        </div>
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-400">More content to enable scrolling</p>
        </div>
      </div>
    </div>
  );
}