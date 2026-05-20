import React from "react";
import { Outlet } from "react-router-dom";
import VetNavbar from "../features/vets/components/VetNavbar";

export default function VetLayout() {
  return (
    <div className="app-bg">
      <VetNavbar />

      {/* Page content wrapper */}
      <div style={{padding: "2rem", display: "flex", justifyContent: "center"}}>
        <Outlet />
      </div>
    </div>
  );
}