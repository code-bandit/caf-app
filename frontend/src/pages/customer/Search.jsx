import { useEffect, useState } from "react";
import RestaurantCard from "../../components/RestaurantCard.jsx";
import BottomNav from "../../components/BottomNav.jsx";
import { listRestaurants } from "../../api/restaurants.api.js";

export default function Search() {
  const [restaurants, setRestaurants] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    listRestaurants().then(setRestaurants);
  }, []);

  const results = restaurants.filter((r) => r.name.toLowerCase().includes(term.trim().toLowerCase()));

  return (
    <>
      <div className="screen">
        <h1 className="page-title">Search</h1>
        <div className="field">
          <input
            placeholder="Search restaurants…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
          />
        </div>

        {term && results.length === 0 && <p className="empty-state">No matches for "{term}".</p>}
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
      <BottomNav />
    </>
  );
}
