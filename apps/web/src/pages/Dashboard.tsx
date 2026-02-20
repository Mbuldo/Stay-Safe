import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, FileText, Heart } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [userData, historyData] = await Promise.all([
        api.getCurrentUser(),
        api.getAssessmentHistory(10),
      ]);
      
      setUser(userData);
      setAssessmentHistory(historyData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalAssessments = assessmentHistory?.totalAssessments || 0;
  const recentAssessments = assessmentHistory?.assessments || [];
  
  // Calculate average risk level
  const getAverageRiskLevel = () => {
    if (recentAssessments.length === 0) return 'Good';
    
    const riskLevels = recentAssessments.map((a: any) => a.riskLevel);
    const hasHigh = riskLevels.includes('high') || riskLevels.includes('critical');
    const hasModerate = riskLevels.includes('moderate');
    
    if (hasHigh) return 'Needs Attention';
    if (hasModerate) return 'Fair';
    return 'Good';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-muted-foreground">
          Here's your health dashboard overview
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Total Assessments */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAssessments}</p>
              <p className="text-sm text-muted-foreground">Assessments</p>
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/10 p-3 rounded-full">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{getAverageRiskLevel()}</p>
              <p className="text-sm text-muted-foreground">Health Status</p>
            </div>
          </div>
        </div>

        {/* Resources Viewed */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Resources Viewed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <div className="bg-card p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>
          <div className="space-y-3">
            {recentAssessments.slice(0, 5).map((assessment: any) => (
              <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{assessment.category.replace('-', ' ')}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assessment.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assessment.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                    assessment.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    assessment.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {assessment.riskLevel}
                  </span>
                  <span className="text-muted-foreground">{assessment.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/assessment"
            className="p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold mb-2">Take an Assessment</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized health insights with AI-powered analysis
            </p>
          </Link>

          <Link
            to="/profile"
            className="p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold mb-2">Update Profile</h3>
            <p className="text-sm text-muted-foreground">
              Keep your health information up to date
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}