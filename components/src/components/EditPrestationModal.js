import React, { useState, useEffect } from 'react';

function EditPrestationModal({ isOpen, onClose, prestation, onSave }) {
    const [cost, setCost] = useState(prestation ? prestation.prestation_cost : '');
    const [duration, setDuration] = useState(prestation ? prestation.prestation_duration : '');

    const handleSave = () => {
        if (prestation) {
            onSave({ ...prestation, prestation_cost: cost, prestation_duration: duration });
        }
        onClose();
    };

    useEffect(() => {
        if (prestation) {
            setCost(prestation.prestation_cost);
            setDuration(prestation.prestation_duration);
        }
    }, [prestation]);

    if (!isOpen || !prestation) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'white', padding: '20px', borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '300px'
        }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Modifier la prestation</h3>
            <div style={{ marginBottom: '15px', fontSize: '1.1em', fontWeight: 'bold' }}>
                {prestation.prestation_name}
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>
                    Coût:
                    <input style={{ width: '100%', padding: '5px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                           type="text" value={cost} onChange={(e) => setCost(e.target.value)} />
                </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>
                    Durée:
                    <input style={{ width: '100%', padding: '5px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                           type="time" value={duration} onChange={(e) => setDuration(e.target.value)} step="60" />
                </label>
            </div>
            <div>
                <button style={{ padding: '5px 10px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer', marginRight: '10px' }}
                        onClick={handleSave}>Sauvegarder</button>
                <button style={{ padding: '5px 10px', borderRadius: '5px', border: 'none', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' }}
                        onClick={onClose}>Annuler</button>
            </div>
        </div>
    );
}

export default EditPrestationModal;
