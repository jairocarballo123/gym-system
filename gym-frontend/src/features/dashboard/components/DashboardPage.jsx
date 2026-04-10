import { Container, Spinner } from 'react-bootstrap';
import { useDashboard } from '../Hooks/useDashboard';
import SaludoUsuario from './SaludoUsuario';
import BotonesAcceso from './BotonesAcceso';
import TarjetasResumen from './TarjetasResumen';
import UltimasActividades from './UltimasActividades';

const DashboardPage = () => {
  const { user, resumen, actividades, loading } = useDashboard();

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container fluid className="p-4">
      <SaludoUsuario nombre={user?.nombre || 'Usuario'} />
      <BotonesAcceso />
      <TarjetasResumen data={resumen} />
      <h5 className="mt-4"> Últimas actividades</h5>
      <UltimasActividades actividades={actividades} />
    </Container>
  );
};

export default DashboardPage;