// import React, { useEffect, useState } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import { faker } from '@faker-js/faker';
// import axios from 'axios';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//   },
// };



// export default function VisitorsChart() {
//   const [filter, setFilter] = useState("daily");
//   const [chartData, setChartData] = useState({labels: [], datasets: []});

//   const fetchVisitorData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`http://localhost:3000/api/data/analytics/visitors-data?filter=${filter}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("API Response:", response.data);

//       const { labels, data } = response.data;

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: "Visitors",
//             data,
//             borderColor: "rgb(53, 162, 235)",
//             backgroundColor: "rgba(53, 162, 235, 0.5)",
//           },
//         ],
//       });
//     } catch (error) {
//       console.error("Error fetching visitor data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchVisitorData();
//   }, [filter]);

//   return (
//     <div className='h-100 w-400' >
//       <h3>Total Visitors</h3>
//       <div>
//         <button onClick={() => setFilter("today")}>Today</button>
//         <button onClick={() => setFilter("yesterday")}>Yesterday</button>
//         <button onClick={() => setFilter("last_week")}>Last Week</button>
//         <button onClick={() => setFilter("last_month")}>Last Month</button>
//         <button onClick={() => setFilter("last_year")}>Last Year</button>
//       </div>
//       <Line  options={options} data={chartData} />
//     </div>
//   );
// }