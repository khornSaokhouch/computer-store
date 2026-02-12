export default function AboutUs() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Us</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are a dedicated team of professionals committed to delivering high-quality solutions and exceptional service to our clients.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Our Mission</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              To empower businesses through innovative technology and creative strategies, fostering growth and success in an ever-evolving digital landscape.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Our Vision</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              To be the leading provider of transformative digital experiences, recognized for our integrity, excellence, and commitment to our partners.
            </p>
          </div>
        </div>
        <div className="mt-24">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">Our Story</h3>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Founded with a passion for excellence, our journey began with a simple goal: to make a meaningful impact. Over the years, we have grown into a diverse team of experts, each bringing unique perspectives and skills to the table. We believe in collaboration, transparency, and continuous improvement.
          </p>
        </div>
      </div>
    </div>
  );
}
