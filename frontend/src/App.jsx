import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/onboarding/Onboarding.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import TwoFactor from "./pages/auth/TwoFactor.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import SelectRestaurant from "./pages/customer/SelectRestaurant.jsx";
import RestaurantDetail from "./pages/customer/RestaurantDetail.jsx";
import AllDishes from "./pages/customer/AllDishes.jsx";
import ItemInfo from "./pages/customer/ItemInfo.jsx";
import Search from "./pages/customer/Search.jsx";
import History from "./pages/customer/History.jsx";
import Complaints from "./pages/customer/Complaints.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ItemForm from "./pages/admin/ItemForm.jsx";
import ItemList from "./pages/admin/ItemList.jsx";
import AdminComplaints from "./pages/admin/AdminComplaints.jsx";
import AdminHistory from "./pages/admin/AdminHistory.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-2fa" element={<TwoFactor />} />

        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/home" element={<SelectRestaurant />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/restaurants/:id/dishes" element={<AllDishes />} />
          <Route path="/dishes/:id" element={<ItemInfo />} />
          <Route path="/search" element={<Search />} />
          <Route path="/history" element={<History />} />
          <Route path="/complaints/new" element={<Complaints />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/home" element={<Dashboard />} />
          <Route path="/admin/items" element={<ItemList />} />
          <Route path="/admin/items/new" element={<ItemForm mode="create" />} />
          <Route path="/admin/items/:id/edit" element={<ItemForm mode="edit" />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/history" element={<AdminHistory />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
