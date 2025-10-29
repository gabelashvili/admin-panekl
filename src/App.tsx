import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Home";
import useAuthedUserStore from "./store/client/useAuthedUserStore";
import { useEffect, useState } from "react";
import { useAuthedUserQuery } from "./store/server/features/auth/queries";
import UsersList from "./pages/UsersList";
import { Modal } from "./components/ui/modal";
  
export default function App() {
  const { user, setAuthedUser } = useAuthedUserStore()
  const authedUserQuery = useAuthedUserQuery(!!localStorage.getItem('token'))
  const [showAudioPermissionPopup, setShowAudioPermissionPopup] = useState(true)

  useEffect(() => {
    if(authedUserQuery.isPending) return
    
    if(authedUserQuery.data) {
      setAuthedUser(authedUserQuery.data)
    }
  }, [authedUserQuery.data, authedUserQuery.isPending, setAuthedUser, user])

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      setShowAudioPermissionPopup(false)
    }
  }, [])

  return (
    <>
    <Modal isOpen={showAudioPermissionPopup} onClose={() => {}} showCloseButton={false}>
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-fadeIn">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
            👋
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">მოგესალმებით!</h2>
          <p className="text-gray-600 mb-6">
           იმისათვის რომ შეძლოთ სისტემის სრულყოფილად გამოყენება დააჭირეთ ღილაკს <strong>თანხმობა</strong>.
          </p>

          <button
            onClick={() => setShowAudioPermissionPopup(false)}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            თანხმობა
          </button>
        </div>
      </div>
    </div>
    </div>
    </Modal>
      <Router>
        <ScrollToTop />
       {!showAudioPermissionPopup && <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {user?.userType === "Admin" && <Route index path="/users" element={<UsersList />} />}

            {/* Others Page */}
            {/* <Route path="/profile" element={<UserProfiles />} /> */}
            {/* <Route path="/calendar" element={<Calendar />} /> */}
            {/* <Route path="/blank" element={<Blank />} /> */}

            {/* Forms */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}

            {/* Tables */}
            {/* <Route path="/basic-tables" element={<BasicTables />} /> */}

            {/* Ui Elements */}
            {/* <Route path="/alerts" element={<Alerts />} /> */}
            {/* <Route path="/avatars" element={<Avatars />} /> */}
            {/* <Route path="/badge" element={<Badges />} /> */}
            {/* <Route path="/buttons" element={<Buttons />} /> */}
            {/* <Route path="/images" element={<Images />} /> */}
            {/* <Route path="/videos" element={<Videos />} /> */}

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} /> */}
            {/* <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>}
      </Router>
    </>
  );
}
