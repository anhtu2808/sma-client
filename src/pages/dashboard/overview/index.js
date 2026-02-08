import { useCandidateProfileQuery } from "@/apis/candidateApi";
import { Col, Row } from "antd";

const summaryCards = [
  {
    title: "Profile Views",
    icon: "visibility",
    value: "1,248",
    suffix: "+12%",
    suffixStyle: "text-green-600 bg-green-50",
    note: "vs. last 30 days",
    color: "text-primary bg-primary/10",
    hover: "hover:border-primary/30",
  },
  {
    title: "Applications",
    icon: "send",
    value: "42",
    suffix: "+5",
    suffixStyle: "text-green-600 bg-green-50",
    note: "Submitted this month",
    color: "text-blue-600 bg-blue-50",
    hover: "hover:border-blue-500/30",
  },
];

const DashboardOverview = () => {
  const { data } = useCandidateProfileQuery();
  const profile = data?.data;
  const user = profile?.user;
  const displayName = user?.fullName || user?.email || "Candidate";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={4} className="text-center md:text-left">
            <div className="inline-flex w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-900 items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
              {user?.avatar ? (
                <img alt="User avatar" className="w-full h-full object-cover opacity-90" src={user.avatar} />
              ) : (
                <span className="text-white text-2xl font-semibold">{avatarLetter}</span>
              )}
            </div>
          </Col>

          <Col xs={24} md={20}>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName.split("@")[0]}!</h1>
              <p className="text-gray-600">Here is what’s happening with your job search applications today.</p>
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="material-icons-round text-[18px]">location_on</span>
                  Ho Chi Minh City
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-icons-round text-[18px]">calendar_month</span>
                  Joined Oct 2024
                </span>
              </div>
            </div>
          </Col>
        </Row>
        </section>
      </Col>

      <Col span={24}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h3>
        <Row gutter={[24, 24]}>
          {summaryCards.map((card) => (
            <Col xs={24} lg={12} key={card.title}>
              <div
                className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group transition-all ${card.hover}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className={`material-icons-round text-[80px] ${card.color.split(" ")[0]}`}>{card.icon}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.color}`}>
                    <span className="material-icons-round text-[20px]">{card.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{card.title}</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.suffixStyle}`}>
                      {card.suffix}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{card.note}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Profile View Trends</h3>
            <select className="text-sm border-gray-300 rounded-lg text-gray-600 focus:ring-primary focus:border-primary">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <line x1="0" y1="160" x2="800" y2="160" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="120" x2="800" y2="120" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="40" x2="800" y2="40" stroke="#E5E7EB" strokeWidth="1" />
              <defs>
                <linearGradient id="gradientArea" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#F25F29", stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: "#F25F29", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path d="M0,160 Q100,120 200,140 T400,80 T600,100 T800,40 V200 H0 Z" fill="url(#gradientArea)" />
              <path
                d="M0,160 Q100,120 200,140 T400,80 T600,100 T800,40"
                fill="none"
                stroke="#F25F29"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 px-2">
            <span>Oct 1</span>
            <span>Oct 5</span>
            <span>Oct 10</span>
            <span>Oct 15</span>
            <span>Oct 20</span>
            <span>Oct 25</span>
            <span>Oct 30</span>
          </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Recent Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <span className="material-icons-round text-[16px]">mail</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">TechCorp viewed your CV</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                      <span className="material-icons-round text-[16px]">check_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application submitted to DevSoft</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
                <button type="button" className="w-full mt-4 text-sm text-primary font-medium hover:text-primary-dark text-center">
                  View all
                </button>
              </div>
            </Col>

            <Col span={24}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">Active CV</h3>
                  <button type="button" className="text-xs text-primary font-medium hover:underline">
                    Manage
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center text-red-500 shadow-sm">
                    <span className="material-icons-round text-[20px]">picture_as_pdf</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Backend_Dev_Final.pdf</p>
                    <p className="text-xs text-gray-500">Updated 2 days ago</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DashboardOverview;
