import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="text-center mt-20 space-y-6 px-6">
      <h1 className="text-3xl md:text-5xl font-bold">
        Welcome to <span className="text-primary">JengaShop</span>
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Discover high-quality products built for East African shoppers.
      </p>
      <Link
        to="/shop"
        className="btn-primary inline-block mt-4 px-6 py-2 rounded-md text-white"
      >
        Start Shopping
      </Link>
    </div>
  );
}
