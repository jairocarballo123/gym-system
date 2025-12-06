import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const PaymentTable = ({ payments, onDelete }) => (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr className="text-muted small text-uppercase">
            <th>Recibo</th>
            <th>Fecha</th>
            <th>Socio</th>
            <th className="text-end">Monto</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr><td colSpan="5" className="text-center py-5 text-muted">Sin registros</td></tr>
          ) : (
            payments.map(p => (
              <tr key={p.id}>
                <td><Badge bg="dark">{p.recibo_id}</Badge></td>
                <td>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                <td>{p.miembro_nombre || p.miembro_id}</td>
                <td className="text-end fw-bold text-success">C$ {parseFloat(p.monto).toFixed(2)}</td>
                <td className="text-center">
                  <Button variant="link" className="text-danger p-0" onClick={() => onDelete(p.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
);

export default PaymentTable;