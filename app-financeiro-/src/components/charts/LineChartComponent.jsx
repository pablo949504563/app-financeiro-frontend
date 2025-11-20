import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const LineChartComponent = ({ data }) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="saldo" />
    </LineChart>
  );
};

export default LineChartComponent;
