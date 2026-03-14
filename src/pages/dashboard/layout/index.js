import { useCandidateProfileQuery } from "@/apis/candidateApi";
import Footer from "@/pages/layout/footer";
import Navbar from "@/pages/layout/navbar";
import { Col, Row } from "antd";
import Sidebar from "@/pages/dashboard/layout/Sidebar";
import { Link, Outlet } from "react-router-dom";
import { useNotificationSocket } from '@/hooks/useNotificationSocket';



const DashboardLayout = () => {
  const { data } = useCandidateProfileQuery();
  const user = data?.data?.user;
  const displayName = user?.fullName || user?.email || "Candidate";
  // useNotificationSocket();

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-primary selection:text-white transition-colors duration-300 min-h-screen print:min-h-0 flex flex-col print:block print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-1 print:flex-none print:h-auto pt-20 print:pt-0 bg-gray-50 print:bg-white dark:bg-background-dark/60 pb-6 print:pb-0 overflow-x-hidden print:overflow-visible">
        <Row gutter={[24, 24]} className="min-h-[calc(100vh-8rem)] print:min-h-0 print:h-auto print:block px-6 lg:px-8 print:px-0 print:mx-0">
          <Col xs={0} lg={7} xl={6} className="print:hidden">
            <Sidebar displayName={displayName} />
          </Col>

          <Col xs={24} lg={17} xl={18} className="min-w-0 print:w-full print:max-w-full print:flex-none print:m-0 print:p-0 print:block">
            <section className="h-full print:h-auto overflow-y-auto overflow-x-hidden print:overflow-visible print:p-0 print:m-0">
              <Outlet />
            </section>
          </Col>
        </Row>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>

      <Link
        to="/ui-kit"
        className="fixed bottom-2 right-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full opacity-20 hover:opacity-100 transition-opacity z-[100] print:hidden"
        title="UI Kit"
      >
        <span className="material-icons-round text-xs">palette</span>
      </Link>
    </div>
  );
};

export default DashboardLayout;
