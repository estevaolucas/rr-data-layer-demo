import { redirect } from "@remix-run/react";

export const loader = () => redirect("/items");
