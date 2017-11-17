const format = require('date-fns/format');

const issueDate = d => format(d, 'YYYY MMMM D');
const reportDate = d => format(d, 'YYYY MMM D');

module.exports = bill => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Bill</title>
</head>
<style>
body {
  margin: 40px;
  font-family: arial, sans-serif;
}
h1 {
  color: #00bcd4;
  width: 100%;
  border-bottom: 3px solid #00bcd4;
}
h2 {
  text-align: right;
}
table {
    border-collapse: collapse;
    width: 100%;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
<body>
<h1>rezsi.io</h1>
<div class="">
<p><b>ID:</b> ${bill.id}</p>
<p><b>Issue date:</b> ${issueDate(bill.createdAt)}</p>
<p><b>Consumption reports:</b> ${reportDate(bill.summary.from)} - ${reportDate(bill.summary.to)}</p>
</div>
<table>
<tr>
<th>Item</th>
<th>Quantity</th>
<th>Unit price</th>
<th>Amount</th>
</tr>
<tr>
<td>Heat</td>
<td>${bill.heatConsumption} kWh</td>
<td>${bill.summary.heatPrice} ${bill.summary.currency}/kWh</td>
<td>${bill.heatConsumption * bill.summary.heatPrice} ${bill.summary.currency}</td>
</tr>
<tr>
<td>Hot water</td>
<td>${bill.hotWaterConsumption} m<sup>3</sup></td>
<td>${bill.summary.hotWaterPrice} ${bill.summary.currency}/m<sup>3</sup></td>
<td>${bill.hotWaterConsumption * bill.summary.hotWaterPrice} ${bill.summary.currency}</td>
</tr>
<tr>
<td>Cold water</td>
<td>${bill.coldWaterConsumption} m<sup>3</sup></td>
<td>${bill.summary.coldWaterPrice} ${bill.summary.currency}/m<sup>3</sup></td>
<td>${bill.coldWaterConsumption * bill.summary.coldWaterPrice} ${bill.summary.currency}</td>
</tr>
</table>
<h2>Total: ${bill.total} ${bill.summary.currency}</h2>
</body>
</html>
`;
