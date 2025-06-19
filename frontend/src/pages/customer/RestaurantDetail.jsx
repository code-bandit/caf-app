import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DishCard from "../../components/DishCard.jsx";
import QueueStatusBar from "../../components/QueueStatusBar.jsx";
import BottomNav from "../../components/BottomNav.jsx";
import BackLink from "../../components/BackLink.jsx";
import { getRestaurant } from "../../api/restaurants.api.js";
import { listByRestaurant } from "../../api/menuItems.api.js";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [mainDishes, setMainDishes] = useState([]);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    getRestaurant(id).then(setRestaurant);
    listByRestaurant(id, "main_dish").then(setMainDishes);
    listByRestaurant(id, "drink").then(setDrinks);
  }, [id]);

  if (!restaurant) {
    return <div className="empty-state">Loading…</div>;
  }

  return (
    <>
      <div className="screen">
        <div className="top-bar">
          <BackLink />
          <Link to={`/complaints/new?restaurantId=${restaurant.id}`} className="btn btn-primary" style={{ width: "auto", padding: "10px 16px", fontSize: 13 }}>
            Log a complaint
          </Link>
        </div>

        <div className="restaurant-thumb" style={{ width: "100%", height: 160, marginBottom: 18 }}>
          <img src="/icons/building.png" alt="" />
        </div>

        <h1 className="page-title" style={{ marginBottom: 12 }}>{restaurant.name}</h1>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            Opens: {restaurant.opens_at?.slice(0, 5)}
            <br />
            Closes: {restaurant.closes_at?.slice(0, 5)}
          </div>
          <div style={{ textAlign: "right", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Availability:
            <br />
            <span className={`status-pill ${restaurant.status}`}>{restaurant.status}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <strong>Queue Status:</strong>
          <QueueStatusBar level={restaurant.queue_status} />
        </div>

        <div className="section-header">
          <h3>Main dish Available</h3>
          <Link to={`/restaurants/${restaurant.id}/dishes?category=main_dish`}>See all</Link>
        </div>
        <div className="dish-grid">
          {mainDishes.slice(0, 4).map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
          {mainDishes.length === 0 && <p className="empty-state">No main dishes yet.</p>}
        </div>

        <div className="section-header">
          <h3>Drinks Available</h3>
          <Link to={`/restaurants/${restaurant.id}/dishes?category=drink`}>See all</Link>
        </div>
        <div className="dish-grid">
          {drinks.slice(0, 4).map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
          {drinks.length === 0 && <p className="empty-state">No drinks yet.</p>}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
