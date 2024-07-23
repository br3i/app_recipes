// src/pages/AboutUs.jsx
import React from 'react';
import '../utils/AboutUs.css'; // Asegúrate de que este archivo exista en la carpeta utils

const AboutUs = () => {
  return (
    <div className="aboutus-container">
    <main className="aboutus-main">
      <section className="aboutus-section">
        <h1>¡Bienvenidos a Recetas Alimenticias!</h1>
        <p>
          En Recetas Alimenticias, creemos que la salud y el bienestar comienzan con una buena alimentación. Nuestra página web está dedicada a proporcionar recetas saludables y deliciosas que puedes preparar con ingredientes disponibles en casa. Nuestro objetivo es inspirar a personas de todas las edades a adoptar hábitos alimenticios saludables sin sacrificar el sabor y la satisfacción de las comidas.
        </p>
        <p>
          Nuestro sistema cuenta con un modelo de aprendizaje que facilita la personalización de tus comidas. Simplemente ingresa los ingredientes disponibles en tu hogar y selecciona un objetivo, como bajar de peso, aumentar la ingesta de proteínas, entre otros. A partir de esta información, nuestro sistema generará tres opciones de recetas recomendadas que se ajustan a tus necesidades y preferencias.
        </p>
        <p>
          Nuestro equipo está formado por apasionados de la cocina y la nutrición que se dedican a crear y compartir recetas que no solo son nutritivas, sino también fáciles de preparar. Cada receta ha sido cuidadosamente seleccionada para asegurarse de que cumpla con nuestros estándares de salud y bienestar.
        </p>
        <p>
          Gracias por ser parte de nuestra comunidad. Esperamos que encuentres en Recetas Alimenticias la inspiración para disfrutar de una alimentación equilibrada y deliciosa. Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros. ¡Estamos aquí para ayudarte a llevar un estilo de vida más saludable!
        </p>
      </section>
      <section className="aboutus-section">
        <h2>Términos y Condiciones</h2>
        <p>
          Bienvenido a Recetas Alimenticias. Al utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones:
        </p>
        <ul>
          <li>
            <strong>Uso del Sitio Web</strong>: El contenido de este sitio es solo para uso informativo y personal. No se permite el uso comercial de nuestros contenidos sin autorización previa.
          </li>
          <li>
            <strong>Propiedad Intelectual</strong>: Todos los contenidos, incluidas las recetas, imágenes y textos, son propiedad de Recetas Alimenticias y están protegidos por las leyes de derechos de autor.
          </li>
          <li>
            <strong>Responsabilidad</strong>: Recetas Alimenticias no se hace responsable por cualquier daño o pérdida derivada del uso de nuestras recetas. Siempre consulta con un profesional de salud antes de realizar cambios significativos en tu dieta.
          </li>
        </ul>
      </section>
      <section className="aboutus-section">
        <h2>Políticas de Privacidad</h2>
        <p>
          En Recetas Alimenticias, respetamos tu privacidad y estamos comprometidos a proteger tu información personal. Esta política describe cómo recopilamos, usamos y protegemos tu información:
        </p>
        <ul>
          <li>
            <strong>Recopilación de Información</strong>: Podemos recopilar información personal como tu nombre, correo electrónico y preferencias alimenticias cuando te registras en nuestro sitio o participas en nuestras encuestas.
          </li>
          <li>
            <strong>Uso de la Información</strong>: Utilizamos esta información para personalizar tu experiencia en nuestro sitio, enviar boletines informativos y mejorar nuestros servicios.
          </li>
          <li>
            <strong>Protección de la Información</strong>: Implementamos medidas de seguridad adecuadas para proteger tu información personal contra accesos no autorizados y divulgaciones.
          </li>
        </ul>
        <p>
          Para más información sobre nuestras políticas de privacidad, por favor contacta con nosotros.
        </p>
      </section>
    </main>
</div>

  );
};

export default AboutUs;
