import { Redirect } from "expo-router";

export default function Index() {
  console.log("Redirecting to /pendientes");

  return <Redirect href="/pendientes" />;
}
