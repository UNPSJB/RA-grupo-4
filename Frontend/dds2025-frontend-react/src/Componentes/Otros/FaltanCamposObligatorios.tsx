import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

// --- IMPORTACIÓN DE IMAGEN LOCAL ---
// Asume que la imagen está en la ruta: src/assets/obligatorio.png
import obligatorioImage from '../../assets/obligatorio.png'; 

// Interfaces (deben coincidir con las definidas en ResponderEncuesta.js)
interface ErrorItem {
    seccionSigla: string;
    preguntaId: number;
    enunciado: string;
}

// Variables de estilo (copiadas del componente ResponderEncuesta para consistencia)
const styles = {
    colorPrincipal: '#1c3144', 
    colorAlerta: '#d9534f', 
    colorFondoTarjeta: '#ffffff',
    colorTerciario: '#e8eef2',
    bordeRadio: '8px',
};

interface FaltanCamposObligatoriosProps {
    errores: ErrorItem[];
    onClose: () => void;
    onJumpToSection: (preguntaId: number) => void;
}

const FaltanCamposObligatorios: React.FC<FaltanCamposObligatoriosProps> = ({ 
    errores, 
    onClose, 
    onJumpToSection 
}) => {

    // Agrupa errores por sección para visualización
    const erroresAgrupados = errores.reduce((acc, curr) => {
        if (!acc[curr.seccionSigla]) {
            acc[curr.seccionSigla] = [];
        }
        // Usamos un Set para almacenar preguntas únicas (por si la lógica de validación se duplica)
        if (!acc[curr.seccionSigla].some(item => item.preguntaId === curr.preguntaId)) {
            acc[curr.seccionSigla].push(curr);
        }
        return acc;
    }, {} as { [key: string]: ErrorItem[] });

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}><XCircle size={24} /></button>
                
                {/* Encabezado del Modal */}
                <div className="modal-header-content">
                    <img 
                        src={obligatorioImage} 
                        alt="Icono de advertencia de campo obligatorio" 
                        className="modal-image" 
                    />
                    <h3 className="modal-title"><AlertTriangle size={30} style={{ marginRight: '10px' }} /> Atención: ¡Faltan Campos!</h3>
                </div>
                
                <p className="modal-subtitle">No puedes enviar la encuesta hasta completar las siguientes preguntas obligatorias:</p>

                <ul className="error-list">
                    {Object.entries(erroresAgrupados).map(([seccionSigla, items]) => (
                        <li key={seccionSigla} className="error-section-group">
                            <span className="section-sigla">{seccionSigla}</span>
                            <ul className="section-error-detail">
                                {items.map((item) => (
                                    <li key={item.preguntaId}>
                                        {item.enunciado}
                                        <button 
                                            onClick={() => onJumpToSection(item.preguntaId)} 
                                            className="jump-button"
                                        >
                                            Ir a la pregunta
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <button onClick={onClose} className="modal-action-button">Cerrar y Corregir</button>
            </div>

            {/* Estilos del Modal (CSS-in-JS) */}
            <style>{`
                .modal-overlay { 
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background-color: rgba(0, 0, 0, 0.7); display: flex; 
                    justify-content: center; align-items: center; z-index: 1000;
                    animation: fadeInModal 0.3s ease-out;
                }
                .modal-content { 
                    background-color: ${styles.colorFondoTarjeta}; padding: 30px; 
                    border-radius: ${styles.bordeRadio}; width: 90%; max-width: 600px; 
                    position: relative; animation: slideIn 0.3s ease-out;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                }
                .modal-close { position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; color: ${styles.colorPrincipal}; }
                
                .modal-header-content { display: flex; align-items: center; margin-bottom: 20px; }
                .modal-image { width: 50px; height: 50px; margin-right: 15px; animation: bounce 1s infinite alternate; }
                
                .modal-title { font-size: 1.6rem; color: ${styles.colorAlerta}; margin-bottom: 0; display: flex; align-items: center; }
                .modal-subtitle { color: #555; margin-bottom: 20px; }
                .error-list { list-style: none; padding: 0; margin-bottom: 25px; max-height: 300px; overflow-y: auto; }
                
                .error-section-group { border: 1px solid #f8d7da; border-radius: 6px; margin-bottom: 15px; padding: 10px; background-color: #f8d7da; }
                .section-sigla { font-weight: bold; color: ${styles.colorPrincipal}; display: block; margin-bottom: 5px; }
                .section-error-detail { list-style: disc; padding-left: 25px; font-size: 0.9rem; }
                .section-error-detail li { margin-bottom: 5px; color: ${styles.colorAlerta}; }
                
                .jump-button { background: none; border: 1px solid ${styles.colorAlerta}; color: ${styles.colorAlerta}; border-radius: 4px; padding: 3px 8px; margin-left: 10px; cursor: pointer; transition: background 0.2s; }
                .jump-button:hover { background-color: ${styles.colorAlerta}; color: white; }
                
                .modal-action-button { 
                    background-color: ${styles.colorPrincipal}; color: white; padding: 10px 20px; border: none; 
                    border-radius: 6px; width: 100%; cursor: pointer; transition: background 0.2s; 
                }
                .modal-action-button:hover { background-color: #002244; }

                /* Animaciones */
                @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
};

export default FaltanCamposObligatorios;