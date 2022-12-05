import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Person4Icon from "@mui/icons-material/Person4";
import { useState } from "react";
import { FaBasketballBall } from "react-icons/fa";
import { GiBasketballJersey } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import SideBarMenu from "./components/SideBarMenu";
import { Equipe } from "./components/Equipe";
import { Tecnico } from "./components/Tecnico";
import { Jogador } from "./components/Jogador";
import { Jogos } from "./components/Jogos";

const routes = [
  {
    path: "/",
    component: Jogos,
  },
  {
    path: "/jogador",
    component: Jogador,
  },
  {
    path: "/equipe",
    component: Equipe,
  },
  {
    path: "/tecnico",
    component: Tecnico,
  },
];

const Router = () => {
  const [expander, setExpander] = useState(true);
  const items = [
    {
      id: 1,
      label: "Jogos",
      icon: FaBasketballBall,
      url: "/",
    },
    {
      id: 2,
      label: "Equipe",
      icon: RiTeamFill,
      url: "/equipe",
    },
    {
      id: 3,
      label: "Jogador",
      icon: GiBasketballJersey,
      url: "/jogador",
    },
    {
      id: 4,
      label: "Tecnico",
      icon: Person4Icon,
      url: "/tecnico",
    },
  ];

  return (
    <BrowserRouter>
      <div
        className={`l-navbar ${expander ? "expander" : "no-expander"}`}
        id="navbar"
      >
        <SideBarMenu
          items={items}
          setExpander={setExpander}
          expander={expander}
        />
      </div>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
