import StatCard from "./StatCard";

const StatsRow = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          infoText={stat.infoText}
          color={stat.color}
          type={stat.type}
        />
      ))}
    </div>
  );
};

export default StatsRow;
