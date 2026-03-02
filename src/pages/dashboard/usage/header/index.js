import Button from "@/components/Button";

const Header = () => {
  return (
    <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usage History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor your feature consumption and activity logs.
          </p>
        </div>
        <Button
          type="button"
          mode="secondary"
          iconLeft={<span className="material-icons-round text-[18px]">download</span>}
        >
          Export CSV
        </Button>
      </div>
    </section>
  );
};

export default Header;