import local_1 from '../assets/local_1.jpg';
import local_2 from '../assets/local_2.jpg';
import local_3 from '../assets/local_3.jpg';
import empleado_1 from '../assets/empleado_1.jpg';
import empleado_2 from '../assets/empleado_2.jpg';
import empleado_3 from '../assets/empleado_3.jpg';
import heroImage from '../assets/top_banner.jpg';


const locales = [
  {
    nombre: "Sede Principal - Miraflores",
    direccion: "Av. Larco 123, Miraflores, Lima",
    imagen: local_1
  },
  {
    nombre: "Sucursal - San Isidro",
    direccion: "Av. Javier Prado Este 456, San Isidro, Lima",
    imagen: local_3
  },
  {
    nombre: "Punto de Venta - Surco",
    direccion: "Jr. Monte Bello 789, Santiago de Surco, Lima",
    imagen: local_2
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

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Tu Salud, Nuestra Prioridad</h1>
          <p className="hero-description">
            En MIFARMA, nos dedicamos a ofrecerte los mejores productos y el asesoramiento farmacéutico
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
              <img src={local.imagen} alt={local.nombre} className="local-image"/>
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
              <img src={empleado.foto} alt={empleado.nombre} className="empleado-foto"/>
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