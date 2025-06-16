import React from 'react';

export default function AppCard({ app, onSelect }: { app: any, onSelect: () => void }) {
  return (
    <div className="border p-4 rounded mb-4 cursor-pointer" onClick={onSelect}>
      <h2 className="text-xl font-bold">{app.name}</h2>
      <p>Platforms: {app.platforms.join(', ')}</p>
      <p>Tags: {app.tags.join(', ')}</p>
      <p>Risk Score: {app.risk_score}</p>
      <p>{app.is_age_appropriate ? "✅ Appropriate" : "⚠️ Not Recommended"}</p>
    </div>
  );
}