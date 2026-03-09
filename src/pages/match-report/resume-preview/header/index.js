import HeaderTop from "./top";
import HeaderBottom from "./bottom";

const MatchReportHeader = () => {
  return (
    <div className="flex-shrink-0 border-b border-neutral-200 bg-white">
      <HeaderTop />
      <HeaderBottom />
    </div>
  );
};

export default MatchReportHeader;
