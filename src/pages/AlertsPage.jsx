import { useCallback, useEffect, useMemo, useState } from 'react';
import AlertBadge from '../components/AlertBadge';
import ConfirmModal from '../components/ConfirmModal';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import SectionTitle from '../components/SectionTitle';
import { useFeedback } from '../hooks';
import { createAlert, deleteAlert, getAlerts, getRegions, updateAlert } from '../services';
import { asNumberOrNull } from '../utils/data';
import { mapValidationErrors } from '../utils/errors';

const RISK_LEVELS = ['BAJO', 'MEDIO', 'ALTO', 'CRITICO'];

const initialForm = {
  regionId: '',
  fechaEvento: '',
  nivelRiesgo: 'BAJO',
  latitud: '',
  longitud: '',
  fuente: '',
  descripcion: ''
};

function AlertsPage() {
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [filterRegionId, setFilterRegionId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const feedback = useFeedback();

  const loadRegions = useCallback(async () => {
    const data = await getRegions();
    setRegions(Array.isArray(data) ? data : []);
  }, []);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAlerts({ regionId: filterRegionId || undefined });
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filterRegionId]);

  useEffect(() => {
    async function init() {
      try {
        await Promise.all([loadRegions(), loadAlerts()]);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    init();
  }, [loadRegions, loadAlerts]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const regionMap = useMemo(() => {
    return regions.reduce((acc, region) => {
      acc[region.id] = region.nombre;
      return acc;
    }, {});
  }, [regions]);

  const columns = useMemo(
    () => [
      { key: 'regionId', header: 'Region', render: (row) => regionMap[row.regionId] || row.regionId },
      { key: 'fechaEvento', header: 'Fecha evento' },
      { key: 'nivelRiesgo', header: 'Nivel riesgo', render: (row) => <AlertBadge level={row.nivelRiesgo} /> },
      { key: 'latitud', header: 'Latitud' },
      { key: 'longitud', header: 'Longitud' },
      { key: 'fuente', header: 'Fuente' },
      { key: 'descripcion', header: 'Descripcion' }
    ],
    [regionMap]
  );

  function onInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId('');
    setValidationErrors({});
  }

  function startEdit(alert) {
    setEditingId(alert.id);
    setForm({
      regionId: alert.regionId || '',
      fechaEvento: alert.fechaEvento ? String(alert.fechaEvento).slice(0, 16) : '',
      nivelRiesgo: alert.nivelRiesgo || 'BAJO',
      latitud: String(alert.latitud || ''),
      longitud: String(alert.longitud || ''),
      fuente: alert.fuente || '',
      descripcion: alert.descripcion || ''
    });
    setValidationErrors({});
    feedback.clear();
  }

  async function onSubmit(event) {
    event.preventDefault();
    feedback.clear();
    setValidationErrors({});

    const payload = {
      regionId: form.regionId,
      fechaEvento: form.fechaEvento ? new Date(form.fechaEvento).toISOString() : null,
      nivelRiesgo: form.nivelRiesgo,
      latitud: asNumberOrNull(form.latitud),
      longitud: asNumberOrNull(form.longitud),
      fuente: form.fuente.trim(),
      descripcion: form.descripcion.trim()
    };

    try {
      if (editingId) {
        await updateAlert(editingId, payload);
        feedback.showSuccess('Alerta actualizada correctamente.');
      } else {
        await createAlert(payload);
        feedback.showSuccess('Alerta creada correctamente.');
      }

      resetForm();
      await loadAlerts();
    } catch (err) {
      setValidationErrors(mapValidationErrors(err.validationErrors));
      feedback.showError(err.message);
    }
  }

  async function confirmDelete() {
    if (!deleteId) {
      return;
    }

    try {
      await deleteAlert(deleteId);
      feedback.showSuccess('Alerta eliminada correctamente.');
      setDeleteId('');
      await loadAlerts();
    } catch (err) {
      feedback.showError(err.message);
      setDeleteId('');
    }
  }

  return (
    <section className="page-container">
      <SectionTitle title="Alertas" subtitle="Eventos de calor y riesgo por region" />

      {feedback.message ? <p className={`feedback feedback-${feedback.type}`}>{feedback.message}</p> : null}

      <FilterBar>
        <label>
          Filtrar por region
          <select value={filterRegionId} onChange={(event) => setFilterRegionId(event.target.value)}>
            <option value="">Todas</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>
        </label>
      </FilterBar>

      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Region
          <select name="regionId" value={form.regionId} onChange={onInputChange} required>
            <option value="">Seleccione una region</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>
          {validationErrors.regionId ? <small className="field-error">{validationErrors.regionId}</small> : null}
        </label>

        <label>
          Fecha evento
          <input type="datetime-local" name="fechaEvento" value={form.fechaEvento} onChange={onInputChange} required />
          {validationErrors.fechaEvento ? <small className="field-error">{validationErrors.fechaEvento}</small> : null}
        </label>

        <label>
          Nivel riesgo
          <select name="nivelRiesgo" value={form.nivelRiesgo} onChange={onInputChange} required>
            {RISK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {validationErrors.nivelRiesgo ? <small className="field-error">{validationErrors.nivelRiesgo}</small> : null}
        </label>

        <label>
          Latitud
          <input name="latitud" type="number" step="0.000001" value={form.latitud} onChange={onInputChange} required />
          {validationErrors.latitud ? <small className="field-error">{validationErrors.latitud}</small> : null}
        </label>

        <label>
          Longitud
          <input name="longitud" type="number" step="0.000001" value={form.longitud} onChange={onInputChange} required />
          {validationErrors.longitud ? <small className="field-error">{validationErrors.longitud}</small> : null}
        </label>

        <label>
          Fuente
          <input name="fuente" value={form.fuente} onChange={onInputChange} required />
          {validationErrors.fuente ? <small className="field-error">{validationErrors.fuente}</small> : null}
        </label>

        <label className="full-width">
          Descripcion
          <textarea name="descripcion" value={form.descripcion} onChange={onInputChange} rows={3} />
          {validationErrors.descripcion ? <small className="field-error">{validationErrors.descripcion}</small> : null}
        </label>

        <div className="form-actions">
          <button className="btn" type="submit">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId ? (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar edicion
            </button>
          ) : null}
        </div>
      </form>

      {loading ? <LoadingSpinner label="Cargando alertas..." /> : null}
      {!loading && error ? <ErrorMessage error={error} onRetry={loadAlerts} /> : null}
      {!loading && !error && alerts.length === 0 ? <EmptyState title="Sin alertas" /> : null}
      {!loading && !error && alerts.length > 0 ? (
        <DataTable
          columns={columns}
          rows={alerts}
          rowKey="id"
          actions={(row) => (
            <div className="row-actions">
              <button type="button" className="btn btn-secondary" onClick={() => startEdit(row)}>
                Editar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => setDeleteId(row.id)}>
                Eliminar
              </button>
            </div>
          )}
        />
      ) : null}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Eliminar alerta"
        message="Confirma la eliminacion del evento de alerta."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId('')}
      />
    </section>
  );
}

export default AlertsPage;
