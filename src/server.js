import {} from "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { flowByFaucetReport } from "./response/faucet";
import { faucetReport } from "./response/faucet";
import { branchRevenuesThisMonth } from "./response/branch";
import { branchRevenuesThisDay } from "./response/branch";
import { graphMonth } from "./response/branch";
import { revenuesByProduct } from "./response/product";
import { revenuesByProductType } from "./response/product";
import { branchFaucets } from "./response/branch";
import { branchProducts } from "./response/branch";
import { branchProductTypes } from "./response/branch";
import { factorCalibration } from "./response/mqtt";
import { mqttResponse } from "./mqtt";
import loginResponse from "./response/login";
import validateResponse from "./response/validate";
import companyBranchResponse from "./response/company_branch";

const withAPIResponse = cb => async (req, res) => {
  const response = await cb(req);
  res.statusCode = response.statusCode;
  res.json(response.data);
};

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,product,role"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.all("/brew/*", async (req, res, next) => {
  try {
    // if (env.NODE_ENV === "development") {
    if (req.headers["x-access-token"]) {
      const user = await verify(req.headers["x-access-token"]);
      req.headers.user = user;
    }
    next();
    // } else {
    const user = await verify(req.headers["x-access-token"]);
    req.headers.user = user;
    next();
    // }
  } catch (err) {
    res.statusCode = 401;
    res.json({
      message: "Token inválido"
    });
  }
});

mqttResponse();

app.post("/calibration/:calibrationNumber/:sensorId", factorCalibration);

app.get("/company-branch", companyBranchResponse.get);
app.post("/auth", loginResponse.get);
app.get("/validate", validateResponse.get);

//app.get("/flowbyfaucet/:request_sensor", withAPIResponse(flowByFaucetReport));

//total de faturamento e litros vendidos na franquia neste mes:
app.get(
  "/branchrevenuesthismonth/:request_branch",
  withAPIResponse(branchRevenuesThisMonth)
);

//total de faturamento e litros vendidos na franquia neste dia:
app.get(
  "/branchrevenuesthisday/:request_branch",
  withAPIResponse(branchRevenuesThisDay)
);

//mostra as torneiras ativas na franquia:
app.get("/branchfaucets/:request_branch", withAPIResponse(branchFaucets));

//mostra os produtos vendidos na franquia:
app.get("/branchproducts/:request_branch", withAPIResponse(branchProducts));

//mostra os tipos de produtos vendidos na franquia:
app.get(
  "/branchproducttypes/:request_branch",
  withAPIResponse(branchProductTypes)
);

//faturamento e outros dados por torneira:
app.get(
  "/faucetreport/:request_branch/:request_faucet",
  withAPIResponse(faucetReport)
);

//faturamento e outros dados por produto:
app.get(
  "/revenuesbyproduct/:request_branch",
  withAPIResponse(revenuesByProduct)
);

//faturamento e outros dados por tipo de produto:
app.get(
  "/revenuesbyproducttype/:request_branch",
  withAPIResponse(revenuesByProductType)
);

//gera grafico das vendas no mes
app.get("/graphmonth/:request_branch", withAPIResponse(graphMonth));

// //relatorios por torneira
// app.get("/flowbyfaucet/:request_sensor", function (req, res){
// 	flow_by_faucet_report(req.params.request_sensor,res);
// });
// app.get("/litersbyfaucet/:request_sensor", function (req, res){
// 	liters_by_faucet_report(req.params.request_sensor,res);
// });
// app.get("/revenuesbyfaucet/:request_sensor", function (req, res){
// 	revenues_by_faucet_report(req.params.request_sensor,res);
// });

app.listen(process.env.PORT, () =>
  console.log(`LISTENING ON PORT ${process.env.PORT}`)
);

// function add(accumulator, a) {
//     return accumulator + a;
// }

// //geração de relatórios
// //fluxo por torneira

// function products_in_branch(active_branch_request, response){

// 	let sql = "SELECT name, price, product_type_id FROM product WHERE branch_id = ?";
// 	let params = [active_branch_request];
// 	sql = mysql.format(sql, params);

// 	connection.query(sql, function (error, results) {
// 	if (error) throw error;
// 	response.json(results);
// 	})};

// function product_types_in_branch(active_branch_request, response){

// 		let sql = "SELECT name FROM product_type WHERE branch_id = ?";
// 		let params = [active_branch_request];
// 		sql = mysql.format(sql, params);

// 		connection.query(sql, function (error, results) {
// 		if (error) throw error;
// 		response.json(results);
// 		})};

// function faucets_in_branch(active_branch_request, response){

// 	let sql = "SELECT sensor FROM faucet WHERE branch_id = ?";
// 	let params = [active_branch_request];
// 	sql = mysql.format(sql, params);

// 	connection.query(sql, function (error, results) {
// 	if (error) throw error;
// 	response.json(results);
// 	})};

// //litros por torneira
// 	function liters_by_faucet_report(faucet_sensor_request, response){

// 	  let sql = "SELECT flow, dt_h, faucet_name, flow.date_creation AS flow_date FROM flow JOIN faucet ON (sensor_code = sensor) WHERE sensor = ?";
// 		let params = [faucet_sensor_request];
// 		sql = mysql.format(sql, params);

// 		connection.query(sql, function (error, results) {
// 		if (error) throw error;

// 		let dados = JSON.stringify(results);
// 		dados = JSON.parse(dados);

// 		let liters =[];
// 		let data =[];

// 		for(let i = 1; i < dados.length ;i++){

// 		let dt = parseFloat(dados[i].dt_h);
// 		let avgflow = (parseFloat(dados[i].flow) + parseFloat(dados[i-1].flow))/2;
// 		liters.push(avgflow*dt);

// 		let element = {
// 			litros: liters.reduce(add),
// 			torneira: dados[i].faucet_name,
// 			data: dados[i].flow_date
// 		}

// 		data.push (element);
// 		};

// 	 	response.json(data);
// 	  })};

// //receita por torneira

// function revenues_by_faucet_report(faucet_sensor_request, response){

// 	let sql = "SELECT flow, dt_h, faucet_name, flow.date_creation AS flow_date, product.name as product_name, price,product_type.name as product_type_name FROM flow JOIN faucet ON (sensor_code = sensor) JOIN product ON (faucet.product_id = product.id) JOIN product_type ON (product.product_type_id = product_type.id) WHERE sensor = ?";
// 	let params = [faucet_sensor_request];
// 	sql = mysql.format(sql, params);

// 	connection.query(sql, function (error, results) {
// 	if (error) throw error;

// 	let dados = JSON.stringify(results);
// 	dados = JSON.parse(dados);

// 	let liters =[];
// 	let data =[];

// 	for(let i = 1; i < dados.length ;i++){

// 	let dt = parseFloat(dados[i].dt_h);
// 	let avgflow = (parseFloat(dados[i].flow) + parseFloat(dados[i-1].flow))/2;
// 	liters.push(avgflow*dt);

// 	let element = {
// 		litros: liters.reduce(add),
// 		faturamento: liters.reduce(add)*dados[i].price,
// 		torneira: dados[i].faucet_name,
// 		preço_L: dados[i].price,
// 		produto: dados[i].product_name,
// 		tipo: dados[i].product_type_name,
// 		data: dados[i].flow_date
// 	}

// 	data.push(element);
// 	};
// 	response.json(data);
// 	})};

// function revenues_by_product_report(product_id_request, response){

// 		let sql = "SELECT flow, dt_h, faucet_name, flow.date_creation AS flow_date, product.name as product_name, price ,product_type.name as product_type_name FROM flow JOIN faucet ON (sensor_code = sensor) JOIN product ON (faucet.product_id = product.id) JOIN product_type ON (product.product_type_id = product_type.id) JOIN company_branch ON (product.branch_id = company_branch.id) WHERE product.id = ? AND company_branch.id = ?";
// 		let params = [product_id_request, active_branch_id];
// 		sql = mysql.format(sql, params);

// 		connection.query(sql, function (error, results) {
// 		if (error) throw error;

// 		let dados = JSON.stringify(results);
// 		dados = JSON.parse(dados);

// 		let liters =[];
// 		let data =[];

// 		for(let i = 1; i < dados.length ;i++){

// 		let dt = parseFloat(dados[i].dt_h);
// 		let avgflow = (parseFloat(dados[i].flow) + parseFloat(dados[i-1].flow))/2;
// 		liters.push(avgflow*dt);

// 		let element = {
// 			litros: liters.reduce(add),
// 			faturamento: liters.reduce(add)*dados[i].price,
// 			torneira: dados[i].faucet_name,
// 			preço_L: dados[i].price,
// 			produto: dados[i].product_name,
// 			tipo: dados[i].product_type_name,
// 			data: dados[i].flow_date
// 		}

// 		data.push(element);
// 		};
// 		response.json(data);
// 		})};

// //http endpoints
// http.createServer(app).listen(3000,function(){
// 	console.log("Server started at port 3000");
// });

// //relatorios por filial
// app.get("/allfaucets/:branch", function (req, res){
// 	faucets_in_branch(req.params.branch,res);
// });
// app.get("/allproducts/:branch", function (req, res){
// 	products_in_branch(req.params.branch,res);
// });
// app.get("/alltypes/:branch", function (req, res){
// 	product_types_in_branch(req.params.branch,res);
// });

// //relatorios por produto
// app.get("/revenuesbyproduct/:product_request", function (req, res){
// 	revenues_by_product_report(req.params.product_request, res);
// });

// app.get("/", function(req,res){
// 	res.json("Testando o endpoint");
// });
