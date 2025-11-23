import React, { useState } from "react";
import logoUnpsjb from "../../assets/logo_unpsjb.png"; // ajusta la ruta según tu proyecto

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const changeMonth = (increment) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendario-container">
      <style>{`
        .calendario-container {
          max-width: 950px;
          margin: 40px auto;
          padding: 30px;
          border-radius: 20px;
          background-color: #ffffff;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          animation: fadeInUp 0.5s ease-out;
        }

        .calendario-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .calendario-header h2 {
          font-size: 2rem;
          font-weight: bold;
          color: #003366;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .calendario-header button {
          padding: 10px 15px;
          border-radius: 8px;
          border: none;
          background-color: #0078D4; /* azul institucional botones */
          color: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          transition: background 0.2s;
        }
        .calendario-header button:hover {
          background-color: #0056b3; /* azul más oscuro al hover */
        }
        .calendario-logo {
          height: 65px;
          width: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
          background: #fafafa;
          border-radius: 12px;
          overflow: hidden;
        }
        th {
          padding: 12px;
          background-color: #3399cc; /* azul más suave para encabezados */
          font-weight: 600;
          color: #fff;
          border: 1px solid #ddd;
        }
        td {
          height: 80px;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 1.1rem;
          background-color: #cce4f6; /* celeste institucional para días */
          transition: background 0.2s, transform 0.1s;
        }
        td:hover {
          background-color: #b3d9f2; /* celeste más oscuro al hover */
          transform: scale(1.05);
        }
        td.bg-today {
          background-color: #fff9c4;
          font-weight: bold;
          border: 2px solid #fbc02d;
        }
        td.bg-selected {
          background-color: #FFD700; /* amarillo institucional al seleccionar */
          color: #000;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(255,215,0,0.6);
        }

        .selected-date {
          margin-top: 20px;
          padding: 20px;
          background-color: #cce4f6; /* celeste institucional */
          border-radius: 12px;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
          text-align: center;
        }
        .selected-date h3 {
          margin-bottom: 10px;
          font-size: 1.3rem;
          color: #003366;
        }
        .selected-date p {
          font-size: 1.2rem;
          font-weight: 600;
          color: #003366;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header con logo al lado del mes */}
      <div className="calendario-header">
        <button onClick={() => changeMonth(-1)}>←</button>
        <h2>
          <img src={logoUnpsjb} alt="Logo UNPSJB" className="calendario-logo" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => changeMonth(1)}>→</button>
      </div>

      {/* Calendar Table */}
      <table>
        <thead>
          <tr>
            {daysOfWeek.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(
            { length: Math.ceil((blanks.length + days.length) / 7) },
            (_, weekIndex) => {
              const start = weekIndex * 7;
              const week = [...blanks, ...days].slice(start, start + 7);

              return (
                <tr key={weekIndex}>
                  {week.map((day, i) => {
                    const thisDate =
                      day !== null
                        ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                        : null;

                    const isToday =
                      thisDate &&
                      thisDate.toDateString() === new Date().toDateString();

                    const isSelected =
                      thisDate &&
                      selectedDate.toDateString() === thisDate.toDateString();

                    return (
                      <td
                        key={i}
                        onClick={() => day && setSelectedDate(thisDate)}
                        className={`
                          ${isSelected ? "bg-selected" : ""}
                          ${isToday && !isSelected ? "bg-today" : ""}
                        `}
                      >
                        {day || ""}
                      </td>
                    );
                  })}
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      {/* Selected date */}
      <div className="selected-date">
        <h3>Fecha seleccionada</h3>
        <p>
          {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]} de{" "}
          {selectedDate.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Calendario;
