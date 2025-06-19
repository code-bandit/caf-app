import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo.jsx";
import RestaurantCard from "../../components/RestaurantCard.jsx";
import BottomNav from "../../components/BottomNav.jsx";
import { listRestaurants } from "../../api/restaurants.api.js";

export default function SelectRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRestaurants()
      .then(setRestaurants)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="hero-panel">
        <div className="top-bar" style={{ marginBottom: 30 }}>
          <Logo light />
          <Link to="/profile" className="avatar">
            <img src="/icons/profile.png" alt="Profile" />
          </Link>
        </div>
        <h1 style={{ fontWeight: 600, fontSize: 24, maxWidth: 260 }}>
          Make your meal choices based on instant availability
        </h1>
      </div>

      <div className="screen" style={{ paddingTop: 24 }}>
        <h2 className="page-title">Select Restaurant</h2>

        {loading && <p className="empty-state">Loading restaurants…</p>}
        {!loading && restaurants.length === 0 && (
          <p className="empty-state">No restaurants available yet.</p>
        )}
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>

      <BottomNav />
    </>
  );
}
