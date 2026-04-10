const SaludoUsuario = ({ nombre }) => {
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  return <h2 className="mb-3">{saludo}  , {nombre}!</h2>;
};
export default SaludoUsuario