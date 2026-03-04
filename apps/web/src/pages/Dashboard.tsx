import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowRight, ClipboardCheck, HeartPulse, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [userData, historyData] = await Promise.all([api.getCurrentUser(), api.getAssessmentHistory(10)]);
        setUser(userData);
        setAssessmentHistory(historyData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const recentAssessments = assessmentHistory?.assessments || [];
  const totalAssessments = assessmentHistory?.totalAssessments || 0;
  const highRiskCount = recentAssessments.filter((item: any) =>
    ['high', 'critical'].includes(item.riskLevel)
  ).length;

  const healthState = useMemo(() => {
    if (highRiskCount > 0) {
      return { label: 'Needs Attention', tone: 'text-rose-600', icon: AlertTriangle };
    }
    if (recentAssessments.some((item: any) => item.riskLevel === 'moderate')) {
      return { label: 'Monitor Closely', tone: 'text-amber-600', icon: Shield };
    }
    return { label: 'Stable', tone: 'text-emerald-600', icon: HeartPulse };
  }, [highRiskCount, recentAssessments]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#1f2d63]/30 border-t-[#1f2d63]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[22px] bg-[#1f2d63] px-8 py-9 text-white shadow-[0_20px_40px_rgba(28,46,69,0.25)]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs tracking-[0.14em] text-slate-300 uppercase">Personal Dashboard</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Welcome back, {user?.username || 'Student'}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              Track your assessment history, watch your risk trend, and follow the next recommended steps.
            </p>
          </div>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 rounded-md bg-[#e84874] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73a65]"
          >
            New Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={ClipboardCheck}
          label="Total Assessments"
          value={`${totalAssessments}`}
          hint="Across all categories"
        />

        <StatCard
          icon={healthState.icon}
          label="Current Signal"
          value={healthState.label}
          hint={highRiskCount > 0 ? `${highRiskCount} high-risk result(s)` : 'No high-risk flags in recent history'}
          tone={healthState.tone}
        />

        <StatCard
          icon={Activity}
          label="Recent Activity"
          value={`${recentAssessments.length} entries`}
          hint="Last 10 assessments"
        />
      </section>

      <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-display text-2xl font-semibold text-[#111a3d]">Recent Assessments</h2>
        {recentAssessments.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">
            No assessments yet. Start with your first health check to build your profile.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {recentAssessments.slice(0, 6).map((assessment: any, index: number) => (
              <motion.article
                key={assessment.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium capitalize text-[#111a3d]">{assessment.category.replace('-', ' ')}</h3>
                    <p className="text-xs text-slate-500">{new Date(assessment.completedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        assessment.riskLevel === 'low'
                          ? 'bg-emerald-100 text-emerald-700'
                          : assessment.riskLevel === 'moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : assessment.riskLevel === 'high'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {assessment.riskLevel}
                    </span>
                    <span className="text-sm font-semibold text-[#111a3d]">{Math.round(assessment.score)}/100</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'text-[#111a3d]',
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone?: string;
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.12em] text-slate-500 uppercase">{label}</p>
          <p className={`mt-2 font-display text-2xl font-semibold ${tone}`}>{value}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f0ff] text-[#1f2d63]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}


