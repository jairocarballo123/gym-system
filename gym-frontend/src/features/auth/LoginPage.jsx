// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../Api/authApi";
import { useAuth } from "../../Hooks/useauth";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  InputGroup,
  FormControl
} from "react-bootstrap";
import { FaUser, FaLock, FaDumbbell } from "react-icons/fa";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authApi.login(id, password);
      login(data);
      navigate("/");
    } catch (err) {
      console.error("[LoginPage] Error:", err);
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <FaDumbbell size={40} className="mb-2" />
              <h1 className="h3 mb-0 fw-bold">Gym System</h1>
              <p className="mb-0 opacity-75">Sistema de Gestión</p>
            </Card.Header>
            
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="h4 fw-bold text-dark">Iniciar Sesión</h2>
                <p className="text-muted mb-0">Ingresa tus credenciales para continuar</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-dark mb-2">
                    ID Empleado
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaUser className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ej: EMP12345"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                      className="border-start-0"
                      disabled={loading}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted small">
                    Ingresa tu ID de empleado asignado
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-dark mb-2">
                    Contraseña
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaLock className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-start-0"
                      disabled={loading}
                    />
                  </InputGroup>
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="py-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2">⚠️</span>
                      <span className="small">{error}</span>
                    </div>
                  </Alert>
                )}

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Verificando...
                    </>
                  ) : (
                    "Ingresar al Sistema"
                  )}
                </Button>

                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    ¿Problemas para acceder? Contacta al administrador
                  </small>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="bg-light text-center py-3">
              <small className="text-muted">
                © {new Date().getFullYear()} Gym System - Todos los derechos reservados
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;