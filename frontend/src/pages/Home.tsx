import React, { useEffect, useState } from 'react';
import { getApps } from '../api/api';
import AppCard from '../components/AppCard';
import FilterPanel from '../components/FilterPanel';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [ageGroup, setAgeGroup] = useState('');
  const [tag, setTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getApps(ageGroup, tag).then(res => setApps(res.data));
  }, [ageGroup, tag]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">App Safety Dashboard</h1>
      <FilterPanel {...{ ageGroup, setAgeGroup, tag, setTag }} />
      {apps.map(app => (
        <AppCard key={app.id} app={app} onSelect={() => navigate(`/apps/${app.id}`)} />
      ))}
    </div>
  );
}