import React, { useState, useMemo, useEffect } from 'react';
import { Alert, AlertSeverity } from './types';
import { getSimulatedAlerts } from './services/alertSimulator';
import AlertQueue from './components/AlertQueue';
import AlertDetailView from './components/AlertDetailView';
import StatCard from './components/StatCard';
import { ShieldCheckIcon } from './components/icons/ShieldCheckIcon';
import { ExclamationTriangleIcon } from './components/icons/ExclamationTriangleIcon';

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const initialAlerts = getSimulatedAlerts();
    setAlerts(initialAlerts);
    setSelectedAlert(initialAlerts[0] || null);
  }, []);

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleAlertStatusChange = (alertId: string, status: 'Investigating' | 'Resolved') => {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
            alert.id === alertId ? { ...alert, status } : alert
        )
      );
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(prev => prev ? {...prev, status} : null);
      }
  };

  const stats = useMemo(() => {
    const counts = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<AlertSeverity, number>);

    return {
      total: alerts.length,
      new: alerts.filter(a => a.status === 'New').length,
      critical: counts.Critical || 0,
      high: counts.High || 0,
    };
  }, [alerts]);

  return (
    <div className="min-h-screen flex flex-col text-gray-200 p-4 font-sans selection:bg-blue-500/30">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">SOC Simulator</h1>
        <p className="text-gray-400">Live Alert Monitoring & AI-Powered Incident Response</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <StatCard title="Total Alerts" value={stats.total} icon={<ShieldCheckIcon className="w-6 h-6 text-gray-400"/>} />
          <StatCard title="New Incidents" value={stats.new} icon={<ExclamationTriangleIcon className="w-6 h-6 text-gray-400"/>} color="text-blue-400" />
          <StatCard title="Critical Alerts" value={stats.critical} icon={<ExclamationTriangleIcon className="w-6 h-6 text-gray-400"/>} color="text-red-500" />
          <StatCard title="High-Severity Alerts" value={stats.high} icon={<ExclamationTriangleIcon className="w-6 h-6 text-gray-400"/>} color="text-orange-400" />
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[60vh]">
        <div className="lg:col-span-1 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 overflow-y-auto">
          <AlertQueue 
            alerts={alerts} 
            selectedAlertId={selectedAlert?.id}
            onAlertSelect={handleAlertSelect}
          />
        </div>
        <div className="lg:col-span-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 overflow-y-auto">
          {selectedAlert ? (
             <AlertDetailView 
                key={selectedAlert.id} 
                alert={selectedAlert}
                onStatusChange={handleAlertStatusChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select an alert to view details and generate a response playbook.</p>
            </div>
          )}
        </div>
      </div>
       <footer className="text-center text-xs text-gray-600 mt-4">
        SOC Simulator | Powered by Gemini
      </footer>
    </div>
  );
};

export default App;
