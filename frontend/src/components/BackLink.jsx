import { useNavigate } from "react-router-dom";

export default function BackLink() {
  const navigate = useNavigate();
  return (
    <button type="button" className="icon-btn back-link" onClick={() => navigate(-1)}>
      <img src="/icons/back-arrow.svg" alt="" />
      Back
    </button>
  );
}
