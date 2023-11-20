import "../styles.css";
import React from "react";
import { Menu } from "antd";

export default function Navbar() {
    return (
      <Menu mode="horizontal" className="navbar">
        <Menu.Item key="home">
          <a href="/home">Home</a>
        </Menu.Item>
        <Menu.Item key="plant-profiles">
          <a href="/plant-profiles">Plant Profiles</a>
        </Menu.Item>
        <Menu.Item key="stats">
          <a href="/stats">Stats</a>
        </Menu.Item>
      </Menu>
      );
}