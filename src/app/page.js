import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-gray-800">Dobrodošli v aplikaciji za beleženje delovnega časa</h1>
        <p className="text-gray-600 mt-4">Začnite z upravljanjem uporabnikov ali beleženjem delovnega časa.</p>
      </div>
    </div>
  );
}
