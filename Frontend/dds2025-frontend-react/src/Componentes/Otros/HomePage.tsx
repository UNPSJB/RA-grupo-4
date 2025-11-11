import React, { useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../App.css"; // Estilos del carrusel están en App.css

const HomePage = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    focusOnSelect: true,
    beforeChange: (current: number, next: number) => setSlideIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, centerPadding: "0px" },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, centerPadding: "60px" },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerPadding: "30px" },
      },
    ],
  };

  const secciones = [
    {
      titulo: "Alumnos",
      icono: "🎓",
      color: "var(--color-alumno)",
      link: "/home/alumno", // <--- RUTA ACTUALIZADA
    },
    {
      titulo: "Docentes",
      icono: "👨‍🏫",
      color: "var(--color-docente)",
      link: "/home/docente", // <--- RUTA ACTUALIZADA
    },
    {
      titulo: "Departamento",
      icono: "🏢",
      color: "var(--color-departamento)",
      link: "/home/departamento", // <--- RUTA ACTUALIZADA
    },
    {
      titulo: "Secretaría",
      icono: "🏛️",
      color: "var(--color-secretaria)",
      link: "/home/secretaria", // <--- RUTA ACTUALIZADA
    },
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido al Sistema</h1>
      <p className="home-subtitle">Desliza para navegar entre las secciones</p>

      <div className="carousel-3d-container">
        <Slider {...settings}>
          {secciones.map((seccion, index) => (
            <div key={index} className="slide-outer-wrapper">
              {/* Hacemos que TODA la tarjeta sea el Link */}
              <Link to={seccion.link} className="carousel-card-link">
                <div
                  className="carousel-card"
                  style={{ borderTopColor: seccion.color }}
                >
                  <div
                    className="card-header"
                    style={{ backgroundColor: seccion.color }}
                  >
                    <span className="card-icon">{seccion.icono}</span>
                    <h3>{seccion.titulo}</h3>
                  </div>
                  <div className="card-body">
                    <p className="carousel-card-cta">Acceder al portal</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomePage;