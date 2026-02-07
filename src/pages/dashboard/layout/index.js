import { useCandidateProfileQuery } from "@/apis/candidateApi";
import Footer from "@/pages/layout/footer";
import Navbar from "@/pages/layout/navbar";
import { Col, Row } from "antd";
import Sidebar from "@/pages/dashboard/layout/Sidebar";
import { Link, Outlet } from "react-router-dom";



const DashboardLayout = () => {
  const { data } = useCandidateProfileQuery();
  const user = data?.data?.user;
  const displayName = user?.fullName || user?.email || "Candidate";

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-primary selection:text-white transition-colors duration-300 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 bg-gray-50 dark:bg-background-dark/60 pb-6 overflow-x-hidden">
        <Row gutter={[24, 24]} className="min-h-[calc(100vh-8rem)] px-6 lg:px-8">
          <Col xs={0} lg={7} xl={6}>
            <Sidebar displayName={displayName} />
          </Col>

          <Col xs={24} lg={17} xl={18} className="min-w-0">
            <section className="h-full overflow-y-auto overflow-x-hidden">
              <Outlet />
            </section>
          </Col>
        </Row>
      </main>
      <Footer />

      <Link
        to="/ui-kit"
        className="fixed bottom-2 right-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full opacity-20 hover:opacity-100 transition-opacity z-[100]"
        title="UI Kit"
      >
        <span className="material-icons-round text-xs">palette</span>
      </Link>
    </div>
  );
};

export default DashboardLayout;
