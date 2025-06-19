import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DishCard from "../../components/DishCard.jsx";
import BottomNav from "../../components/BottomNav.jsx";
import BackLink from "../../components/BackLink.jsx";
import { listByRestaurant } from "../../api/menuItems.api.js";

export default function AllDishes() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const [items, setItems] = useState([]);

  useEffect(() => {
    listByRestaurant(id, category).then(setItems);
  }, [id, category]);

  return (
    <>
      <div className="screen">
        <BackLink />
        <h1 className="page-title">{category === "drink" ? "All Drinks" : "All Dishes"}</h1>

        <div className="dish-grid">
          {items.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
          {items.length === 0 && <p className="empty-state">Nothing here yet.</p>}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
