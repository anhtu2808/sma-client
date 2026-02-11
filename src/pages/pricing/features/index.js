const FeaturesTable = () => {
  return (
    <section className="mb-24 overflow-x-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Compare Features</h2>
      </div>
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr>
            <th className="p-4 bg-gray-50/50 rounded-tl-2xl border-b border-gray-100 text-sm font-bold text-gray-400 uppercase tracking-wider">
              Feature
            </th>
            <th className="p-4 bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-900 text-center">Free</th>
            <th className="p-4 bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-900 text-center">Pro</th>
            <th className="p-4 bg-gray-50/50 rounded-tr-2xl border-b border-gray-100 text-sm font-bold text-gray-900 text-center">
              Premium
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="p-4 bg-gray-50/30 text-xs font-extrabold text-gray-400 uppercase tracking-widest" colSpan={4}>
              Resume & AI
            </td>
          </tr>
          <tr>
            <td className="p-4 text-sm font-medium text-gray-700">AI Resume Optimizations</td>
            <td className="p-4 text-sm text-center text-gray-500">10 / month</td>
            <td className="p-4 text-sm text-center text-gray-900 font-semibold">100 / month</td>
            <td className="p-4 text-sm text-center text-gray-900 font-semibold">Unlimited</td>
          </tr>
          <tr>
            <td className="p-4 text-sm font-medium text-gray-700">Cover Letter Generator</td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-gray-200">close</span>
            </td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-primary">check_circle</span>
            </td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-primary">check_circle</span>
            </td>
          </tr>
          <tr>
            <td className="p-4 bg-gray-50/30 text-xs font-extrabold text-gray-400 uppercase tracking-widest" colSpan={4}>
              Applications
            </td>
          </tr>
          <tr>
            <td className="p-4 text-sm font-medium text-gray-700">Priority Job Applications</td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-gray-200">close</span>
            </td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-primary">check_circle</span>
            </td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-primary">check_circle</span>
            </td>
          </tr>
          <tr>
            <td className="p-4 text-sm font-medium text-gray-700">Direct HR Messaging</td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-gray-200">close</span>
            </td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-gray-200">close</span>
            </td>
            <td className="p-4 text-center">
              <span className="material-icons-round text-primary">check_circle</span>
            </td>
          </tr>
          <tr>
            <td className="p-4 bg-gray-50/30 text-xs font-extrabold text-gray-400 uppercase tracking-widest" colSpan={4}>
              Support
            </td>
          </tr>
          <tr>
            <td className="p-4 text-sm font-medium text-gray-700">Customer Support</td>
            <td className="p-4 text-sm text-center text-gray-500">Email</td>
            <td className="p-4 text-sm text-center text-gray-900 font-semibold">Priority Email</td>
            <td className="p-4 text-sm text-center text-gray-900 font-semibold">24/7 Live Chat</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default FeaturesTable;
