import { useState, useEffect } from 'react';
import local_1 from '../assets/local_1.jpg';
import local_2 from '../assets/local_2.jpg';
import local_3 from '../assets/local_3.jpg';
import empleado_1 from '../assets/empleado_1.jpg';
import empleado_2 from '../assets/empleado_2.jpg';
import empleado_3 from '../assets/empleado_3.jpg';
import heroImage from '../assets/top_banner.jpg';
import banner1 from '../assets/banner1.jpg'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'

const PromoBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      imagen: banner1,
      titulo: 'Delivery Gratis en todo Lima',
      descripcion: 'Recibe tus medicamentos en la puerta de tu casa sin costo adicional. Válido por este mes.',
      btnTexto: 'Pide ahora'
    },
    {
      imagen: banner2,
      titulo: '25% de Descuento en Cuidado de la Piel',
      descripcion: 'Las mejores marcas de dermocosmética con un descuento especial. ¡Renueva tu rutina!',
      btnTexto: 'Ver Ofertas'
    },
    {
      imagen: banner3,
      titulo: 'Consulta con Nuestros Expertos',
      descripcion: '¿Tienes dudas? Habla con nuestros químicos farmacéuticos en línea y recibe la mejor asesoría.',
      btnTexto: 'Consultar'
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="promo-banner-container">
      <div
        className="promo-slider"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="promo-slide" key={index}>
            <div className="promo-image-container">
              <img src={slide.imagen} alt={slide.titulo} />
            </div>
            <div className="promo-content">
              <h2>{slide.titulo}</h2>
              <p>{slide.descripcion}</p>
              <button className="promo-button">{slide.btnTexto}</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="promo-nav prev">←</button>
      <button onClick={nextSlide} className="promo-nav next">→</button>
      <div className="dots-container">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

function Home() {
  const locales = [
    {
      nombre: "Sede Principal - Miraflores",
      direccion: "Av. Larco 123, Miraflores, Lima",
      imagen: local_1
    },
    {
      nombre: "Sucursal - San Isidro",
      direccion: "Av. Javier Prado Este 456, San Isidro, Lima",
      imagen: local_2
    },
    {
      nombre: "Punto de Venta - Surco",
      direccion: "Jr. Monte Bello 789, Santiago de Surco, Lima",
      imagen: local_3
    }
  ];

  const empleados = [
    {
      nombre: "Dra. Ana Torres",
      puesto: "Química Farmacéutica Jefe",
      foto: empleado_1
    },
    {
      nombre: "Carlos Vega",
      puesto: "Técnico en Farmacia",
      foto: empleado_2
    },
    {
      nombre: "Sofia Reyes",
      puesto: "Atención al Cliente",
      foto: empleado_3
    }
  ];

  return (
    <div className="home-page">
      <PromoBanner />
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Tu Salud, Nuestra Prioridad</h1>
          <p className="hero-description">
            En Mifarma, nos dedicamos a ofrecerte los mejores productos y el asesoramiento farmacéutico
            que necesitas para cuidar de ti y tu familia. Calidad y confianza en cada compra.
          </p>
          <a href="/medicamentos" className="hero-button">Ver Productos</a>
        </div>
        <div className="hero-image-container">
          <img
            src={heroImage}
            alt="Farmacia moderna y limpia"
            className="hero-image"
          />
        </div>
      </section>

      <section className="locales-section">
        <h2 className="section-title">Nuestros Locales</h2>
        <div className="carousel-container">
          {locales.map((local, index) => (
            <div className="local-card" key={index}>
              <img src={local.imagen} alt={local.nombre} className="local-image" />
              <div className="local-info">
                <h3>{local.nombre}</h3>
                <p>{local.direccion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="empleados-section">
        <h2 className="section-title">Conoce a Nuestro Equipo</h2>
        <div className="empleados-container">
          {empleados.map((empleado, index) => (
            <div className="empleado-card" key={index}>
              <img src={empleado.foto} alt={empleado.nombre} className="empleado-foto" />
              <h3>{empleado.nombre}</h3>
              <p>{empleado.puesto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;