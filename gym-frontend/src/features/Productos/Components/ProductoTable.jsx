// src/features/productos/components/ProductoTable.jsx
import React from 'react';
import { Table, Badge, Dropdown, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaBoxes, FaDollarSign, FaPlusCircle, FaEllipsisV, FaBox } from 'react-icons/fa';

const ProductoTable = ({ productos, onEdit, onDelete, onVerMovimientos, onAjustarStock }) => {
  if (!productos || productos.length === 0) {
    return (
      <div className="bg-white rounded-3 shadow-sm border p-5 text-center text-muted">
        <FaBox size={40} className="mb-3 text-secondary opacity-50" />
        <p className="mb-0 fw-medium">No hay productos registrados en el inventario</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3 shadow-sm border overflow-hidden">
      <Table hover responsive className="align-middle mb-0 table-borderless">
        <thead className="bg-light border-bottom text-secondary small fw-bold text-uppercase">
          <tr>
            <th className="px-4 py-3" style={{ width: '80px' }}>ID</th>
            <th className="py-3">Producto</th>
            <th className="py-3">Precio de Venta</th>
            <th className="py-3">Stock Disponible</th>
            <th className="py-3">Estado</th>
            <th className="px-4 py-3 text-end" style={{ width: '100px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id} className="border-bottom last-border-0">
              {/* ID */}
              <td className="px-4 py-3 text-muted fw-medium">#{prod.id}</td>
              
              {/* Nombre e Icono */}
              <td className="py-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-inline-flex">
                    <FaBox size={14} />
                  </div>
                  <span className="fw-semibold text-dark">{prod.nombre}</span>
                </div>
              </td>
              
              {/* Precio */}
              <td className="py-3">
                <span className="fw-bold text-dark">
                  <FaDollarSign className="small text-muted me-1" />
                  {Number(prod.precio).toFixed(2)}
                </span>
              </td>
              
              {/* Stock con Badge Inteligente */}
              <td className="py-3">
                {prod.stockActual === 0 ? (
                  <Badge bg="danger" className="bg-opacity-10 text-danger rounded-pill px-3 py-2 fw-semibold">
                    Agotado
                  </Badge>
                ) : prod.stockActual <= 5 ? (
                  <Badge bg="warning" className="bg-opacity-10 text-warning text-dark rounded-pill px-3 py-2 fw-semibold">
                    Bajo Stock ({prod.stockActual} u.)
                  </Badge>
                ) : (
                  <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-3 py-2 fw-semibold">
                    {prod.stockActual} unidades
                  </Badge>
                )}
              </td>
              
              {/* Estado */}
              <td className="py-3">
                <Badge 
                  bg={prod.statusId === 1 ? 'success' : 'secondary'} 
                  className={`bg-opacity-10 ${prod.statusId === 1 ? 'text-success' : 'text-secondary'} rounded-pill px-2.5 py-1.5`}
                >
                  ● {prod.statusId === 1 ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              
              {/* Acciones en un Menú Desplegable Premium */}
              <td className="px-4 py-3 text-end">
                <Dropdown align="end">
                  <Dropdown.Toggle as={Button} variant="light" size="sm" className="border-0 bg-transparent p-1 shadow-none">
                    <FaEllipsisV className="text-muted" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow border-0 dropdown-menu-end rounded-3">
                    <Dropdown.Item onClick={() => onVerMovimientos(prod)} className="py-2 text-secondary">
                      <FaBoxes className="me-2 text-info" /> Ver movimientos
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onAjustarStock(prod)} className="py-2 text-secondary">
                      <FaPlusCircle className="me-2 text-success" /> Ajustar stock
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => onEdit(prod)} className="py-2 text-secondary">
                      <FaEdit className="me-2 text-warning" /> Editar producto
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(prod)} className="py-2 text-danger">
                      <FaTrash className="me-2" /> Desactivar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductoTable;