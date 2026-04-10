// features/auth/components/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Container, Row, Col, Card, Form, Button, Alert,
  InputGroup
} from "react-bootstrap";
import { FaUser, FaLock, FaDumbbell } from "react-icons/fa";

const LoginPage = () => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ nombre, password });
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
                <p className="text-muted mb-0">Ingresa tus credenciales</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-dark mb-2">
                    Usuario
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaUser className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="border-start-0"
                      disabled={loading}
                    />
                  </InputGroup>
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
                      <span className="spinner-border spinner-border-sm me-2" />
                      Verificando...
                    </>
                  ) : (
                    "Ingresar al Sistema"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;