import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Dashboard from './Components/Dashboard';
import MainMonitoring from './Components/Monitoring/MainMonitoring'
import './App.css';
import DashboardCenter from "./Components/DashboardCenter";
import DailyMonitoring from "./Components/Monitoring/DailyMonitoring"
import ProductTime from "./Components/Product/ProductTime";
import ProductResultTargetLine from "./Components/Product/ProductResultTargetLine";
import ProductResultTargetModel from "./Components/Product/ProductResultTargetModel";
import POBalance from "./Components/Order/POBalance";
import InventoryLongTerm from "./Components/WIP/InventoryLongTerm";
import ScanStatus from "./Components/Report/ScanStatus";
import SettingSewingQTY from "./Components/Report/SettingSewingQTY";
import DailyHourProd from "./Components/Report/dailyHourProd";
import Login from "./Components/Login/Login";
import ProductPCard from './Components/Product/ProductPCard';
import ProductPersonel from './Components/Product/ProductPersonel';
import ProductNosewMesin from './Components/Product/ProductNosewMesin';
import ProductKKMaterial from './Components/Product/ProductKKMaterial';
import ProductMaterialBalance from './Components/Product/ProductMaterialBalance';
import ProductSewingMesinCounter from './Components/Product/ProductSewingMesinCounter';
import ProductDailyProdTrend from './Components/Product/ProductDailyProdTrend';
import NotFound from './Components/NotFound';
import ProductSPKBalance from './Components/Product/ProductSPKBalance';
import ProductDetail from './Components/Product/ProductDetail';


function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/" >
          <Login />
        </Route>
        <Route exact path="/NotFound" >
          <NotFound />
        </Route>
        <Route path="/Dashboard" >
            <Dashboard />
            <DashboardCenter />
        </Route>
        <Route path="/MainMonitoring" >
          <Dashboard/>
          <MainMonitoring />
        </Route>
        <Route path="/DailyMonitoring" >
          <Dashboard/>
          <DailyMonitoring />
        </Route>
        <Route path="/ProductDetail" >
          <Dashboard/>
          <ProductDetail />
        </Route>
        <Route path="/ProductTime" >
          <Dashboard/>
          <ProductTime />
        </Route>
        <Route path="/ProductPCard" >
          <Dashboard/>
          <ProductPCard />
        </Route>
        <Route path="/ProductPersonel" >
          <Dashboard/>
          <ProductPersonel />
        </Route>
        <Route path="/ProductNosewMesin" >
          <Dashboard/>
          <ProductNosewMesin />
        </Route>
        <Route path="/ProductKKMaterial" >
          <Dashboard/>
          <ProductKKMaterial />
        </Route>
        <Route path="/ProductMaterialBalance" >
          <Dashboard/>
          <ProductMaterialBalance />
        </Route>
        <Route path="/ProductSewingMesinCounter" >
          <Dashboard/>
          <ProductSewingMesinCounter />
        </Route>
        <Route path="/ProductDailyProdTrend" >
          <Dashboard/>
          <ProductDailyProdTrend />
        </Route>
        <Route path="/ProductSPKBalance" >
          <Dashboard/>
          <ProductSPKBalance />
        </Route>
        <Route path="/ProductResultTargetLine" >
          <Dashboard/>
          <ProductResultTargetLine />
        </Route>
        <Route path="/ProductResultTargetModel" >
          <Dashboard/>
          <ProductResultTargetModel />
        </Route>
        <Route path="/POBalance" >
          <Dashboard/>
          <POBalance />
        </Route>
        <Route path="/InventoryLongTerm" >
          <Dashboard/>
          <InventoryLongTerm />
        </Route>
        <Route path="/ScanStatus" >
          <Dashboard/>
          <ScanStatus />
        </Route>
        <Route path="/SettingSewingQTY" >
          <Dashboard/>
          <SettingSewingQTY />
        </Route>
        <Route path="/DailyHourProd" >
          <Dashboard/>
          <DailyHourProd />
        </Route>
      </Switch>
    </Router>
    </>
  );
}

export default App;
