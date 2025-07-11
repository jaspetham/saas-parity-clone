import { HasPermission } from "@/components/HasPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsBySaasChartData,
} from "@/server/db/productView";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import { ViewsByCountryChart } from "../_components/charts/ViewsByCountryChart";
import { ViewsByDayChart } from "../_components/charts/ViewsByDayChart";
import { ViewsBySaasChart } from "../_components/charts/ViewsBySaasChart";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: {
    interval?: string;
    timezone?: string;
    productId?: string;
  };
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const interval =
    CHART_INTERVALS[searchParams.interval as keyof typeof CHART_INTERVALS] ??
    CHART_INTERVALS.last7Days;
  const timezone = searchParams.timezone || "UTC";
  const productId = searchParams.productId;

  return (
    <>
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsBySaasCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByCountryCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
        </div>
      </HasPermission>
    </>
  );
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByDayChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsBySaasCard(
  props: Parameters<typeof getViewsBySaasChartData>[0]
) {
  const chartData = await getViewsBySaasChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Saas Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsBySaasChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
