import { Suspense } from "react";
import ContributeForm from "@/components/knowledge-hub/ContributeForm";

export default function ContributePage() {
  return (
    <Suspense>
      <ContributeForm />
    </Suspense>
  );
}
