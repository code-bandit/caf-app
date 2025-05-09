import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="restaurant-card">
      <div className="restaurant-thumb">🏛️</div>
      <div className="restaurant-meta">
        <h3>{restaurant.name}</h3>
        <p>
          Opens: {restaurant.opens_at?.slice(0, 5)} · Closes: {restaurant.closes_at?.slice(0, 5)}
        </p>
      </div>
      <span className={`status-pill ${restaurant.status}`}>{restaurant.status}</span>
    </Link>
  );
}
