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


function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/" >
          <Login />
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
        <Route path="/ProductTime" >
          <Dashboard/>
          <ProductTime />
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
