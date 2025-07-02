import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Define types for our API response
interface Medicine {
  id: number;
  name: string;
  description: string | null;
  generic_id: number;
  quantity: number;
  price: number;
  batch_no: string;
  dosage: string;
  strength: string | null;
  route: string;
  notes: string | null;
  expiry_date: string;
  category: string | null;
  manufacturer: string;
  status: number;
  image: string | null;
  created_at: string | null;
  updated_at: string;
  total_quantity: number | null;
  expense_records_count?: number;
}

interface DashboardData {
  AvailableMedicines: number;
  TodayExpense: any[];
  MostUsedMedicines: Medicine[];
  NearExpiryMedicines: Medicine[];
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if data exists in sessionStorage first
    const cachedData = sessionStorage.getItem('dashboardData');

    if (cachedData) {
      setDashboardData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      // Fetch data from the API
      fetch('/api/dashboard')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
          }
          return response.json();
        })
        .then(data => {
          setDashboardData(data);
          // Cache the data in sessionStorage
          sessionStorage.setItem('dashboardData', JSON.stringify(data));
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  // Prepare data for pie chart - most used medicines
  const prepareMostUsedData = () => {
    if (!dashboardData?.MostUsedMedicines) return [];

    return dashboardData.MostUsedMedicines.map(medicine => ({
      name: medicine.name,
      value: medicine.expense_records_count || 0
    }));
  };

  // Calculate days until expiry for each medicine
  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format data for near expiry chart
  const prepareExpiryData = () => {
    if (!dashboardData?.NearExpiryMedicines) return [];

    return dashboardData.NearExpiryMedicines
      .filter(med => med.expiry_date !== "1970-01-01T00:00:00.000000Z") // Filter out invalid dates
      .map(medicine => ({
        name: medicine.name,
        daysLeft: calculateDaysUntilExpiry(medicine.expiry_date),
        quantity: medicine.quantity
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5); // Take only the 5 closest to expiry
  };

  // Prepare inventory value data
  const prepareInventoryValueData = () => {
    if (!dashboardData?.NearExpiryMedicines) return [];

    return dashboardData.NearExpiryMedicines.map(medicine => ({
      name: medicine.name,
      value: medicine.price * medicine.quantity
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 by value
  };

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium">Loading dashboard data...</div>
            <Progress className="mt-4 w-64" value={75} />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load dashboard data: {error}</AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Medicines</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.AvailableMedicines || 0}</div>
              <p className="text-xs text-muted-foreground">Total medicine variants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Expenses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.TodayExpense.length || 0}</div>
              <p className="text-xs text-muted-foreground">Transactions today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.NearExpiryMedicines.filter(m =>
                  m.expiry_date !== "1970-01-01T00:00:00.000000Z" &&
                  calculateDaysUntilExpiry(m.expiry_date) < 30).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Medicines expire in 30 days</p>
            </CardContent>
          </Card>

        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Most Used Medicines */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Most Used Medicines</CardTitle>
              <CardDescription>Usage frequency across all records</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareMostUsedData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareMostUsedData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expiry Timeline */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Expiry Timeline</CardTitle>
              <CardDescription>Days until medicine expiry</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareExpiryData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="daysLeft" fill="#8884d8" name="Days Left" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Expiry Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Expiry Alerts</CardTitle>
            <CardDescription>Medicines approaching expiration date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.NearExpiryMedicines
                .filter(med => med.expiry_date !== "1970-01-01T00:00:00.000000Z")
                .map(medicine => {
                  const daysLeft = calculateDaysUntilExpiry(medicine.expiry_date);
                  let alertType = "default";

                  if (daysLeft < 15) alertType = "destructive";
                  else if (daysLeft < 30) alertType = "warning";

                  return daysLeft < 60 ? (
                    <Alert key={medicine.id} variant={alertType as any}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{medicine.name} ({medicine.batch_no})</AlertTitle>
                      <AlertDescription>
                        Expires in {daysLeft} days on {new Date(medicine.expiry_date).toLocaleDateString()}.
                        Current stock: {medicine.quantity} units.
                      </AlertDescription>
                    </Alert>
                  ) : null;
                })}

              {!dashboardData?.NearExpiryMedicines.some(
                med => med.expiry_date !== "1970-01-01T00:00:00.000000Z" &&
                calculateDaysUntilExpiry(med.expiry_date) < 60
              ) && (
                <div className="text-center py-4 text-muted-foreground">
                  No medicines expiring in the next 60 days.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
