'use client';

import { useState, useMemo } from 'react';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { getOrders, verifyPasscode } from '@/app/actions/orderActions';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Hourglass
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  size: string;
  fabric?: string;
  color?: string;
}

interface Order {
  _id: string;
  customerName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  amount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
  razorpayOrderId: string;
}

export default function AdminOrdersPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingPasscode, setCheckingPasscode] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingPasscode(true);

    try {
      const isValid = await verifyPasscode(passcode);
      if (isValid) { 
        setIsAuthorized(true);
        fetchOrders();
        toast.success('Access Granted');
      } else {
        toast.error('Invalid Passcode');
      }
    } catch (error) {
      toast.error('Verification failed');
    }
    setCheckingPasscode(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  // Derived Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'failed' ? order.amount : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    
    return { totalOrders, totalRevenue, pendingOrders, paidOrders };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.razorpayOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.phone.includes(searchQuery);
        
      return matchesSearch;
    });
  }, [orders, searchQuery]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4">
               <Package className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-2">Enter your secure passcode to access orders</p>
          </div>
          
          <form onSubmit={handlePasscodeSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="••••"
                autoFocus
                maxLength={4}
              />
            </div>
            <button
              type="submit"
              disabled={checkingPasscode}
              className="w-full cursor-pointer bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
            >
              {checkingPasscode ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-48">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Manage orders and track revenue</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium"
          >
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
            <p className="text-gray-500 animate-pulse">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+2.5%</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
              </div>

               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">Paid Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.paidOrders}</h3>
              </div>

               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Hourglass className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</h3>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center sticky top-24 z-30">
              <div className="relative w-full md:w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    {/* Order Header Summary */}
                    <div 
                      className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors"
                      onClick={() => toggleOrderExpand(order._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          order.status === 'paid' ? 'bg-green-100 text-green-600' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {order.status === 'paid' ? <CheckCircle className="w-5 h-5" /> :
                           order.status === 'pending' ? <Hourglass className="w-5 h-5" /> :
                           <XCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.customerName}</h4>
                          <p className="text-xs text-gray-500 mt-1 font-mono">#{order.razorpayOrderId}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-1">
                        <div className="text-lg font-bold text-gray-900">₹{order.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <div className="hidden md:block text-gray-400">
                        {expandedOrders.has(order._id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {expandedOrders.has(order._id) && (
                      <div className="border-t border-gray-100 bg-gray-50/30 p-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          {/* Shipping Info */}
                          <div>
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shipping Information</h5>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-3 shadow-sm">
                              <div>
                                <span className="block text-xs text-gray-400 mb-1">Customer Name</span>
                                <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                              </div>
                              <div>
                                <span className="block text-xs text-gray-400 mb-1">Phone Number</span>
                                <span className="text-sm font-medium text-gray-900">{order.address.phone}</span>
                              </div>
                              <div>
                                <span className="block text-xs text-gray-400 mb-1">Shipping Address</span>
                                <span className="text-sm text-gray-700 leading-relaxed">
                                  {order.address.street}<br/>
                                  {order.address.city}, {order.address.state} - {order.address.zip}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Items List */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                               <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items ({order.items.length})</h5>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-100 shadow-sm divide-y divide-gray-100">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                  <div>
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Size: {item.size} 
                                      {item.fabric && ` • ${item.fabric}`}
                                      {item.color && ` • ${item.color}`}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
