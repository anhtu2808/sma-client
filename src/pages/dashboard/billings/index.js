import { Col, Row } from "antd";
import Plans from "./plans";

const MOCK_QUOTAS = [
  { key: "resume", label: "AI Resume Optimizations", used: 4, total: 10 },
  { key: "applications", label: "Job Applications", used: 12, total: 20 },
  { key: "messages", label: "Direct Messages", used: 2, total: 5 },
];

const BillingPlans = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={12}>
              <div className="h-full rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-primary shadow-sm">
                      <span className="material-icons-round text-[26px]">star</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">You&apos;re on Free Plan</h3>
                      <p className="text-sm text-gray-500">Upgrade anytime to unlock more power.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-orange-100">
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 transition-all shadow-sm"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            </Col>

            <Col xs={24} xl={12}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-gray-900">Quotas remaining</h3>
                  <span
                    className="material-icons-round text-gray-400 text-xl cursor-help"
                    title="Usage for the current billing cycle"
                  >
                    info
                  </span>
                </div>

                <div className="space-y-6">
                  {MOCK_QUOTAS.map((quota) => {
                    const percent = Math.min(100, Math.round((quota.used / quota.total) * 100));
                    return (
                      <div className="space-y-2" key={quota.key}>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700">{quota.label}</span>
                          <span className="font-bold text-gray-900">
                            {quota.used}
                            <span className="text-gray-400 font-medium"> / {quota.total}</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </Col>

      <Col span={24}>
        <Plans />
      </Col>

      <Col span={24}>
        <p className="text-xs text-gray-400">
          Mock mode: view is using local mock data. Next step is wiring `GET /v1/plans` and mapping prices by duration.
        </p>
      </Col>
    </Row>
  );
};

export default BillingPlans;
