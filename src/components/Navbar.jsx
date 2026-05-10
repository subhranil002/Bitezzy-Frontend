import {
  FaBars,
  FaBolt,
  FaCrown,
  FaEnvelope,
  FaFire,
  FaHeart,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
  FaUser,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import { GiHerbsBundle } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { LOGO_URL } from "../constants";
import { logout } from "../redux/slices/authSlice";

const colorClasses = {
  pink: {
    hoverBg: "hover:bg-pink-200",
    iconDefault: "bg-pink-100",
    text: "text-pink-500",
  },
  red: {
    hoverBg: "hover:bg-red-200",
    iconDefault: "bg-red-100",
    text: "text-red-500",
  },
  sky: {
    hoverBg: "hover:bg-sky-200",
    iconDefault: "bg-sky-100",
    text: "text-sky-500",
  },
  emerald: {
    hoverBg: "hover:bg-emerald-200",
    iconDefault: "bg-emerald-100",
    text: "text-emerald-500",
  },
  amber: {
    hoverBg: "hover:bg-amber-200",
    iconDefault: "bg-amber-100",
    text: "text-amber-500",
  },
};

export default function Navbar({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isSearchPage = location.pathname.includes("/search");
  const { userData, isLoggedIn, role } = useSelector((state) => state.auth);

  const sections = [
    {
      id: "for-you",
      label: "Recommended",
      icon: FaUser,
      color: "pink",
      show: isLoggedIn,
    },
    {
      id: "trending",
      label: "Trending",
      icon: FaFire,
      color: "red",
      show: true,
    },
    {
      id: "fresh",
      label: "Fresh & New",
      icon: GiHerbsBundle,
      color: "sky",
      show: true,
    },
    {
      id: "quick",
      label: "Quick & Easy",
      icon: FaBolt,
      color: "emerald",
      show: true,
    },
    {
      id: "premium",
      label: "Premium Picks",
      icon: FaCrown,
      color: "amber",
      show: true,
    },
  ];

  const closeSidebar = () => {
    const drawer = document.getElementById("navbar-drawer");
    if (drawer) drawer.checked = false;
  };

  const handleSearch = () => {
    navigate(`/search`);
    closeSidebar();
  };

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;

      const offset = 130;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }

    closeSidebar();
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  function modifyCloudinaryURL(url) {
    if (url === "" || url === null) return "";
    if (import.meta.env.VITE_IMAGE_TRANSFORMATION === "true") {
      return url.replace(
        "/upload/",
        "/upload/ar_1:1,c_auto,g_auto,w_500/r_max/",
      );
    }
    return url;
  }

  return (
    <div className="drawer bg-gray-50/30">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-linear-to-br from-orange-50 to-amber-50">
        <header className="sticky top-4 z-50 px-4 md:px-8 w-full max-w-[1400px] mx-auto pointer-events-none transition-all duration-300">
          <div className="navbar pointer-events-auto min-h-16 md:min-h-20 bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(249,115,22,0.06)] rounded-3xl px-3 transition-all">
            {/* Left: Hamburger & Elegant Branding */}
            <div className="navbar-start gap-2 md:gap-4 flex-1">
              <label
                htmlFor="navbar-drawer"
                className="btn btn-ghost btn-circle drawer-button w-10 h-10 md:w-12 md:h-12 bg-orange-50/50 hover:bg-orange-100/50 text-orange-600 transition-colors duration-300"
                aria-label="Open menu"
              >
                <FaBars className="w-4 h-4 md:w-5 md:h-5" />
              </label>

              <Link
                to="/"
                className="btn btn-ghost group flex items-center gap-3 px-2 rounded-2xl hover:bg-transparent"
                aria-label="Bitezzy home"
              >
                <div className="flex flex-col justify-center">
                  <span className="text-xl md:text-2xl font-black tracking-tight ">
                    Bitezzy
                  </span>
                </div>
              </Link>
            </div>

            {/* Search Input */}
            {!isSearchPage && (
              <div className="navbar-center hidden lg:flex flex-1 justify-center max-w-xl w-full">
                <form
                  onSubmit={handleSearch}
                  className="w-full relative group"
                  role="search"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500"></div>
                  <div
                    className="relative flex items-center bg-gray-200/70 hover:bg-white focus-within:bg-white border border-transparent hover:border-gray-300 focus-within:border-orange-200 rounded-2xl px-4 transition-all duration-300"
                    onClick={handleSearch}
                  >
                    <FaSearch className="w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search amazing recipes..."
                      className="input input-ghost w-full focus:bg-transparent focus:outline-none border-none text-sm text-gray-800 placeholder-gray-400 pl-3 h-10 md:h-11"
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Right: User / Login */}
            <div className="ml-4 flex items-center gap-3">
              {isLoggedIn ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar backdrop-blur-sm bg-linear-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 rounded-full ring-2 ring-white/30">
                      <img
                        alt="Profile Avatar"
                        src={modifyCloudinaryURL(
                          userData?.profile?.avatar?.secure_url || "",
                        )}
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content rounded-2xl mt-3 w-64 p-3 shadow-2xl shadow-orange-300/30 border border-orange-200 backdrop-blur-xl bg-white/95 text-gray-900 space-y-1"
                  >
                    <li className="p-2 border-b border-orange-100">
                      <Link to={`/profile/${userData?._id.toString()}`}>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 rounded-full bg-linear-to-br from-orange-500 to-red-500">
                              <img
                                alt="Profile Avatar"
                                src={modifyCloudinaryURL(
                                  userData?.profile?.avatar?.secure_url || "",
                                )}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 truncate max-w-[145px]">
                              {userData?.profile?.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate max-w-[145px]">
                              {userData?.email}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/profile/${userData?._id.toString()}`}
                        className="rounded-lg hover:bg-orange-50 transition-colors py-3"
                      >
                        <FaUser className="text-orange-500" /> My Profile
                      </Link>
                    </li>
                    {role === "CHEF" && (
                      <li>
                        <Link
                          to="/dashboard"
                          className="rounded-lg hover:bg-orange-50 transition-colors py-3"
                        >
                          <FaTachometerAlt className="text-orange-500" />{" "}
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/chat"
                        className="rounded-lg hover:bg-orange-50 transition-colors py-3"
                      >
                        <FaUtensils className="text-orange-500" /> Recipe Chat
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/profile/${userData?._id.toString()}/favourites`}
                        className="rounded-lg hover:bg-orange-50 transition-colors py-3"
                      >
                        <FaHeart className="text-rose-500" /> My Favorites
                      </Link>
                    </li>
                    <li className="border-t border-orange-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors py-3 w-full text-left"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="btn m-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-xl shadow-orange-500/40 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:shadow-orange-500/50 px-6 animate-bounce-gentle group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Login
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mt-8">{children}</main>
      </div>

      {/* The Sidebar Drawer */}
      <div className="drawer-side z-100">
        <label
          htmlFor="navbar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay bg-gray-900/20 backdrop-blur-sm"
        ></label>

        {/* Floating Island Sidebar */}
        <aside className="menu p-0 w-80 min-h-full bg-white/95 backdrop-blur-3xl border-r border-orange-100 flex flex-col pt-8 pb-6 px-4 text-base-content">
          {/* Brand area */}
          <div className="flex items-start justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-4xl shadow-md border border-orange-100">
                  <img src={LOGO_URL} alt="Bitezzy" />
                </div>
              </div>
              <div>
                <h2 className="font-black text-2xl tracking-tight text-gray-900">
                  Bitezzy
                </h2>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                  Discover. Cook. Impress. Repeat
                </p>
              </div>
            </div>

            {/* Close Button Component */}
            <label
              htmlFor="navbar-drawer"
              aria-label="close sidebar"
              className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-red-500 hover:bg-red-50 lg:hidden transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </label>
          </div>

          {/* Mobile Search - Visible only on small screens */}
          {!isSearchPage && (
            <form
              onSubmit={handleSearch}
              className="mb-6 px-2 lg:hidden"
              role="search"
            >
              <div
                className="relative flex items-center bg-gray-200 hover:bg-gray-200 border border-transparent focus-within:border-orange-300 rounded-2xl px-4 transition-all"
                onClick={handleSearch}
              >
                <FaSearch className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-ghost w-full focus:bg-transparent focus:outline-none border-none text-sm text-gray-800 placeholder-gray-500 pl-3 h-11"
                />
              </div>
            </form>
          )}

          {/* Navigation Links using DaisyUI Menu styling */}
          <ul className="menu w-full px-0 gap-1 flex-1 overflow-y-auto no-scrollbar">
            <li className="menu-title text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Menu
            </li>

            <li>
              <Link
                to="/"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  closeSidebar();
                }}
                className="group flex items-center gap-4 py-3 rounded-2xl hover:bg-orange-200 transition-all duration-300 active:bg-transparent"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                  <FaHome className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                  Home
                </span>
              </Link>
            </li>

            {isHome &&
              sections
                .filter((section) => section.show)
                .map((section) => {
                  const Icon = section.icon;
                  const colors = colorClasses[section.color];

                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => handleScroll(section.id)}
                        className={`group flex items-center gap-4 py-3 rounded-2xl transition-all duration-300 ${colors.hoverBg}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300
                          ${colors.iconDefault}`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-colors ${colors.text}`}
                          />
                        </div>

                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                          {section.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
          </ul>

          {/* Footer Contact area inside Drawer */}
          <div className="mt-auto pt-6 w-full px-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/our-team"
              onClick={closeSidebar}
              className="group flex items-center gap-4 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <FaUsers className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
              </div>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">
                Our Team
              </span>
            </Link>
            <Link
              to="/contact"
              onClick={closeSidebar}
              className="group flex items-center gap-4 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <FaEnvelope className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
              </div>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">
                Need Help?
              </span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
