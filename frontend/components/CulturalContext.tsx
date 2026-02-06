"use client";

import { motion } from "framer-motion";
import Card from "./ui/Card";
import { CulturalContext as CulturalContextType } from "@/lib/types";

interface CulturalContextProps {
  context: CulturalContextType;
}

export default function CulturalContext({ context }: CulturalContextProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Cultural Context</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm uppercase tracking-wider text-spotify-green mb-2">
            Historical Background
          </h3>
          <p className="text-spotify-light text-sm leading-relaxed">
            {context.historical_background}
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-spotify-green mb-3">
            Cultural References
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {context.references.map((ref, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-3"
              >
                <p className="text-white font-medium text-sm">{ref.term}</p>
                <p className="text-spotify-light text-xs mt-1">
                  {ref.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-spotify-green mb-2">
            Cultural Impact
          </h3>
          <p className="text-spotify-light text-sm leading-relaxed">
            {context.cultural_impact}
          </p>
        </div>
      </div>
    </Card>
  );
}
