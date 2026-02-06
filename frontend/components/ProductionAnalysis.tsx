"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { ProductionAnalysis as ProductionAnalysisType } from "@/lib/types";

interface ProductionAnalysisProps {
  production: ProductionAnalysisType;
}

export default function ProductionAnalysis({
  production,
}: ProductionAnalysisProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Production Analysis</h2>

      <div className="space-y-6">
        <p className="text-spotify-light text-sm leading-relaxed">
          {production.overview}
        </p>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-spotify-green mb-3">
            Techniques
          </h3>
          <div className="flex flex-wrap gap-2">
            {production.techniques.map((technique) => (
              <Badge key={technique} className="bg-spotify-green/10 text-spotify-green">
                {technique}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-spotify-green mb-3">
            Instruments
          </h3>
          <div className="flex flex-wrap gap-2">
            {production.instruments.map((instrument) => (
              <Badge key={instrument}>{instrument}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-spotify-green mb-2">
            Notable Elements
          </h3>
          <p className="text-spotify-light text-sm leading-relaxed">
            {production.notable_elements}
          </p>
        </div>
      </div>
    </Card>
  );
}
