import React, { useState } from "react";
import logoUnpsjb from "../../assets/logo_unpsjb.png"; 
import { Send, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react"; 
import { useNavigate, useParams } from "react-router-dom"; 
import { useAuth } from "../../hooks";

interface MarcaFecha {
  date: Date;
  title: string;
  type: 'inicio' | 'cierre' | 'personal'; 
}

const fechasRelevantes: MarcaFecha[] = [
  { date: new Date(2025, 7, 1), title: 'Inicio de Segundo Cuatrimestre', type: 'inicio' }, // Agosto (7) - Día 1
  { date: new Date(2025, 11, 1), title: 'Fin de Segundo Cuatrimestre', type: 'cierre' },  // Diciembre (11) - Día 1
  { date: new Date(2025, 10, 28), title: 'Día de pesca HP TEAM', type: 'personal' }, // Noviembre (10) - Día 28
  { date: new Date(2025, 10, 25), title: 'Sprint 4 Review', type: 'personal' } // Noviembre (10) - Día 25
];
const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); 
  const navigate = useNavigate();
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
    setSelectedDate(null); 
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

  const getDayMark = (date: Date): MarcaFecha | undefined => {
    return fechasRelevantes.find(mark => 
        mark.date.toDateString() === date.toDateString()
    );
  };
  
  const handleSelectDate = (date: Date | null) => {
      setSelectedDate(date);
  };
  
  const { currentUser, isAuthenticated, isLoading, login, error}=useAuth();

   const getHomePath = () => {
      const rol = currentUser?.role_name;

      switch (rol) {
          case "alumno":
              return "/home/alumno";
          case "docente":
              return "/home/docente";
          case "departamento":
              return "/home/departamento";
          case "secretaria_academica":
              return "/home/secretaria";
          default:
              return "/home";
      }
  };

   const handleGoBack = () => {
        navigate(getHomePath());
    };

  return (
    <div className="calendario-container">
      <style>{`
        /* Estilos generales y de tarjeta se mantienen */
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
          background-color: #0078D4;
          color: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          transition: background 0.2s;
        }
        .calendario-header button:hover {
          background-color: #0056b3;
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
          background-color: #3399cc;
          font-weight: 600;
          color: #fff;
          border: 1px solid #ddd;
        }
        td {
          height: 80px;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 1.1rem;
          background-color: #cce4f6; /* celeste institucional para días por defecto */
          transition: background 0.2s, transform 0.1s;
          position: relative; 
          vertical-align: top;
          padding: 8px 0;
        }
        td:hover {
          background-color: #b3d9f2;
          transform: scale(1.05);
          z-index: 10;
        }
        td.bg-today {
          background-color: #b3d9f2;
          font-weight: bold;
          border: 2px solid #0078D4;
        }
        td.bg-selected {
          background-color: #69a4e0ff;
          color: #000;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(37, 82, 231, 0.6);
          z-index: 11;
        }
        
        /* --- ESTILO: DÍA CON EVENTO (AMARILLO CLARO) --- */
        td.day-with-mark {
            background-color: #fffacd; /* Amarillo muy claro */
            /* Resaltar ligeramente el borde */
            border: 1px solid #f0e68c; 
        }
        /* Asegurar que el color de hover siga funcionando sobre el amarillo */
        td.day-with-mark:hover {
            background-color: #fae69e; 
        }

        /* Ajuste para los números de día */
        .day-number {
          display: block;
          font-size: 1.2rem;
          margin-bottom: 5px;
        }
        
        /* Eliminamos los puntos de color */
        .event-marker { display: none; }
        
        /* --- ESTILOS DE TOOLTIP FLOTANTE --- */
        
        /* El contenedor del día (td) necesita la clase para activar el hover */
        .day-with-mark:hover .event-tooltip {
            visibility: visible;
            opacity: 1;
        }

        .event-tooltip {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 12px;
            border-radius: 6px;
            background-color: #003366; 
            color: white;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: opacity 0.3s, bottom 0.3s;
            pointer-events: none;
            z-index: 20; 
        }
        
        /* Flecha del Tooltip */
        .event-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #003366 transparent transparent transparent;
        }


        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /*Boton de atras*/
                .go-back-button {
                    background-color: #f0f4f8;
                    color: #0078D4;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease;
                }

                .go-back-button:hover {
                    background-color: #e8f4ff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

      `}</style>

      {/* Header con logo al lado del mes */}
      <button 
                  className="go-back-button"
                  onClick={handleGoBack}
                >
                  <ArrowLeft size={20} />
                  Regresar al inicio
          </button>
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
                      selectedDate &&
                      selectedDate.toDateString() === thisDate.toDateString();
                      
                    const mark = thisDate ? getDayMark(thisDate) : undefined;

                    return (
                      <td
                        key={i}
                        onClick={() => day && handleSelectDate(thisDate)}
                        className={`
                          ${isSelected ? "bg-selected" : ""}
                          ${isToday && !isSelected ? "bg-today" : ""}
                          ${mark ? "day-with-mark" : ""} 
                        `}
                      >
                        {day ? (
                          <>
                            <span className="day-number">{day}</span>
                            {mark && (
                                <>
                                    <span className="event-tooltip">
                                        {mark.title}
                                    </span>
                                </>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      <div className="selected-date">
        <h3>Fecha seleccionada</h3>
        <p>
          {selectedDate 
            ? `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`
            : "Seleccione un día"}
        </p>
      </div>
    </div>
  );
};

export default Calendario;