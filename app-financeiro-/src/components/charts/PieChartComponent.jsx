import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const PieChartComponent = ({ data }) => {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="valor"
        nameKey="categoria"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, index) => (
          <Cell key={index} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
