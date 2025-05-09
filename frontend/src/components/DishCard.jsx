import { Link } from "react-router-dom";

export default function DishCard({ item }) {
  return (
    <Link to={`/dishes/${item.id}`} className="dish-card">
      <div className="dish-thumb">{item.category === "drink" ? "🥤" : "🍽️"}</div>
      <h4>{item.name}</h4>
      <span className="price">₦{Number(item.price).toLocaleString()}</span>
    </Link>
  );
}
