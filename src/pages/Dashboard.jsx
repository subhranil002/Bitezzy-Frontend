import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import ChefDashboard from "./Chef/ChefDashboard";
import RequireAuth from "../components/auth/RequireAuth";

function Dashboard() {
    const { role } = useSelector((state) => state.auth);

    if (role === "ADMIN") {
        return <AdminDashboard />;
    }

    if (role === "CHEF") {
        return <ChefDashboard />;
    }

    // Fallback or unauthorized
    return (
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-700">Access Denied</h1>
        </div>
    );
}

export default Dashboard;
