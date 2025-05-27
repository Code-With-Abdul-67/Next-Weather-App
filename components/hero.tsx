// components/Hero.tsx
export const Hero = () => {
  return (
    <section className="w-full py-12 flex justify-center items-center">
      <div className="w-full max-w-xl rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/20 p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Welcome to the Weather App</h1>
        <p className="text-lg text-default-400">
          Get real-time weather updates and forecasts for your location.
        </p>
      </div>
    </section>
  );
};
