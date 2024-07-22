import React from 'react';
import '../utils/TablaNutricional.css';

const truncateToTwoDecimals = (value) => {
  return Math.floor(value * 100) / 100;
};

const TablaNutricional = ({ receta }) => {
  const {
    calorias_totales,
    proteinas_totales,
    carbohidratos_totales,
    grasas_totales,
    azucares_totales,
    fibra_total,
    sodio_total,
  } = receta;

  return (
    <div className="tabla-nutricional">
      <h3>Info. Nutricional</h3>
      <table>
        <thead>
          <tr>
            <th>Nutrientes</th>
            <th>Por porción</th>
            <th>% IR*</th>
          </tr>
        </thead>
        <tbody>
          {calorias_totales && (
            <tr>
              <td>Calorías</td>
              <td>{truncateToTwoDecimals(calorias_totales)} kcal</td>
              <td>{Math.round((calorias_totales / 2000) * 100)}%</td>
            </tr>
          )}
          {grasas_totales && (
            <tr>
              <td>Grasa</td>
              <td>{truncateToTwoDecimals(grasas_totales)} g</td>
              <td>{Math.round((grasas_totales / 70) * 100)}%</td>
            </tr>
          )}
          {carbohidratos_totales && (
            <tr>
              <td>Carbohidratos</td>
              <td>{truncateToTwoDecimals(carbohidratos_totales)} g</td>
              <td>{Math.round((carbohidratos_totales / 300) * 100)}%</td>
            </tr>
          )}
          {azucares_totales && (
            <tr>
              <td>&nbsp;&nbsp;Azúcar</td>
              <td>{truncateToTwoDecimals(azucares_totales)} g</td>
              <td>{Math.round((azucares_totales / 50) * 100)}%</td>
            </tr>
          )}
          {fibra_total && (
            <tr>
              <td>Fibra</td>
              <td>{truncateToTwoDecimals(fibra_total)} g</td>
              <td>{Math.round((fibra_total / 25) * 100)}%</td>
            </tr>
          )}
          {proteinas_totales && (
            <tr>
              <td>Proteína</td>
              <td>{truncateToTwoDecimals(proteinas_totales)} g</td>
              <td>{Math.round((proteinas_totales / 50) * 100)}%</td>
            </tr>
          )}
          {sodio_total && (
            <tr>
              <td>Sodio</td>
              <td>{truncateToTwoDecimals(sodio_total)} g</td>
              <td>{Math.round((sodio_total / 2.4) * 100)}%</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>* Ingesta de referencia de un adulto medio (8400 kJ / 2000 kcal)</p>
    </div>
  );
};

export default TablaNutricional;
