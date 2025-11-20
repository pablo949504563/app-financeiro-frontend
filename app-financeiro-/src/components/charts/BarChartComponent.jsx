import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="receita" />
      <Bar dataKey="despesa" />
    </BarChart>
  );
};

export default BarChartComponent;
