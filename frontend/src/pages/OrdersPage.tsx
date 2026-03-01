import { Package, RefreshCw, Clock, CheckCircle2, Truck, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllOrders } from '@/hooks/useQueries';
import { formatPrice } from '@/lib/utils';
import { OrderStatus } from '../backend';

export function OrdersPage() {
  const { data: orders, isLoading, refetch, isFetching } = useGetAllOrders();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return (
          <Badge variant="outline" className="gap-1 text-xs border-amber-400/50 text-amber-600 bg-amber-50">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case OrderStatus.confirmed:
        return (
          <Badge variant="outline" className="gap-1 text-xs border-primary/50 text-primary bg-primary/5">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </Badge>
        );
      case OrderStatus.delivered:
        return (
          <Badge variant="outline" className="gap-1 text-xs border-green-500/50 text-green-600 bg-green-50">
            <Truck className="w-3 h-3" />
            Delivered
          </Badge>
        );
    }
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">All Orders</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${orders?.length ?? 0} orders total`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 rounded-xl"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">No orders yet</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Orders will appear here once customers start placing them.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground w-[180px]">Order ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Buyer</TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">Address</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Items</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Total</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, idx) => (
                  <TableRow
                    key={order.orderId}
                    className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {order.orderId.slice(0, 18)}...
                    </TableCell>
                    <TableCell className="font-medium text-sm">{order.buyerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                      {order.deliveryAddress}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {order.items.reduce((sum, item) => sum + Number(item.quantity), 0)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm price-text">
                      {formatPrice(order.totalAmountCents)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </main>
  );
}
