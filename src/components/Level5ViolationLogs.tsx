
import React from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface ViolationLog {
  id: number;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface Level5ViolationLogsProps {
  violationLogs: ViolationLog[];
}

const Level5ViolationLogs: React.FC<Level5ViolationLogsProps> = ({ violationLogs }) => {
  return (
    <div className="bg-white/90 rounded-2xl p-4 h-1/5">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="w-4 h-4 text-purple-600" />
        <h3 className="text-base font-semibold text-gray-700">Proctoring Violations</h3>
      </div>
      <div className="h-20 overflow-y-auto space-y-1">
        {violationLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">No violations detected</span>
          </div>
        ) : (
          violationLogs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start space-x-2 p-2 rounded-lg ${
                log.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <AlertTriangle className={`w-3 h-3 mt-0.5 ${
                log.type === 'error' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div className="flex-1">
                <p className={`text-xs font-medium ${
                  log.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {log.message}
                </p>
                <p className="text-xs text-gray-500">
                  {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Level5ViolationLogs;
