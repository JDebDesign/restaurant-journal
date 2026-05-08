import { useNavigate } from 'react-router-dom';

const FOOD_PHOTOS = [
  '/assets/homepage/food-1.jpg',
  '/assets/homepage/food-2.jpg',
  '/assets/homepage/food-3.jpg',
  '/assets/homepage/food-4.jpg',
  '/assets/homepage/food-5.jpg',
  '/assets/homepage/food-6.jpg',
  '/assets/homepage/food-7.jpg',
];

const FEATURES = [
  {
    icon: '/assets/homepage/icon-rate.svg',
    title: 'Rate & Review',
    description: 'Keep track of the flavors that defined your evening.',
  },
  {
    icon: '/assets/homepage/icon-track.svg',
    title: 'Track Visits',
    description: 'Remember exactly when you discovered that hidden gem.',
  },
  {
    icon: '/assets/homepage/icon-map.svg',
    title: 'Build Your Food Map',
    description: 'A personal catalog of your culinary adventures.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start w-full min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>

      {/* Nav */}
      <header
        className="flex items-center justify-between w-full shrink-0 px-5 sm:px-10 lg:px-16 border-b"
        style={{ height: 72, borderColor: '#e6dfd6' }}
      >
        <span className="font-serif font-bold text-xl sm:text-2xl whitespace-nowrap" style={{ color: '#2d1b14' }}>
          Restaurant Journal
        </span>
        <div className="flex items-center gap-3">
          {/* On mobile only show Log In */}
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-lg border text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ borderColor: '#e6dfd6', color: '#2d1b14', backgroundColor: 'transparent' }}
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="hidden sm:flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#2d1b14' }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-16 w-full py-12 sm:py-14 lg:py-16">

        {/* Headline + CTA */}
        <div className="flex flex-col items-center gap-8 sm:gap-10 px-5 sm:px-10 lg:px-16 w-full">
          <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
            {/* Logo icon */}
            <img
              src="/assets/homepage/icon-logo.svg"
              alt=""
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[60px] lg:h-[60px]"
            />
            {/* Headline */}
            <h1
              className="font-serif font-bold text-center w-full"
              style={{
                fontSize: 'clamp(32px, 8vw, 64px)',
                lineHeight: 1.1,
                color: '#2d1b14',
              }}
            >
              Your dining story
              <br />
              starts here
            </h1>
            {/* Subtitle */}
            <p
              className="text-center text-base sm:text-lg max-w-md sm:max-w-xl"
              style={{ lineHeight: 1.6, color: '#6b5a52' }}
            >
              Log every meal, savor every memory. Sign in to start your restaurant journal.
            </p>
          </div>
          {/* CTA */}
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center justify-center h-12 px-6 sm:px-8 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ backgroundColor: '#bc592d' }}
          >
            Log In To Get Started
          </button>
        </div>

        {/* Photo strip — scrollable on mobile/tablet, full-width row on desktop */}
        <div className="w-full overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div
            className="flex gap-3 px-5 sm:px-10 lg:px-16"
            style={{ height: 200 }}
          >
            {FOOD_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="relative shrink-0 overflow-hidden rounded-lg lg:flex-1"
                style={{ width: 'clamp(120px, 30vw, 160px)' }}
              >
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-8 w-full px-5 sm:px-10 lg:px-16">
          {FEATURES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="flex flex-row sm:flex-col gap-4 sm:gap-5 p-6 sm:p-7 lg:p-8 rounded-2xl border bg-white"
              style={{ borderColor: '#e6dfd6' }}
            >
              <img src={icon} alt="" className="w-8 h-8 shrink-0" />
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="font-serif font-bold text-lg sm:text-xl" style={{ color: '#2d1b14' }}>
                  {title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5a52' }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <div className="w-full mt-auto pt-16 sm:pt-20">
        <footer
          className="flex items-center justify-center w-full border-t py-10 sm:py-12 px-5"
          style={{ borderColor: '#e6dfd6' }}
        >
          <p className="text-xs text-center" style={{ color: '#6b5a52' }}>
            © 2026 Restaurant Journal. Savor every memory.
          </p>
        </footer>
      </div>

    </div>
  );
}
