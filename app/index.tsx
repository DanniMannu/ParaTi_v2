/*redireciona para o grupo do role */
// app/index.tsx
import { Redirect } from "expo-router";
import { useRole } from "../src/context/RoleContext";

/**
 * Redireciona para o grupo certo com base no role atual.
 * Importante: usar caminhos ABSOLUTOS a partir da raiz ("/(grupo)").
 */
export default function Index() {
  const { role } = useRole();

  if (role === "restaurante") {
    return <Redirect href="/(restaurante)" />;
  }
  if (role === "cliente") {
    return <Redirect href="/(cliente)" />;
  }
  return <Redirect href="/(entregador)" />;
}
