import ScoreCard from "./ScoreCard";

const SidebarHeader = () => {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-200 p-5 bg-white">
      <ScoreCard score={88} />
      
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <div className="text-base font-bold text-neutral-900">
          NAB Inovation - JavaScript Developer
        </div>
        <div className="text-[13px] font-medium text-neutral-500">
          JavaScript Engineer
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;