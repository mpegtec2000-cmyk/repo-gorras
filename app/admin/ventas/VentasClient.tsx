"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Download, Eye, Calendar, DollarSign, ShoppingBag, CheckCircle, Clock, X, Package, TrendingUp } from "lucide-react";
import { Order, OrderStatus } from "@/lib/orders";
import { Product, displayImages, formatCLP } from "@/lib/products";
import styles from "./Ventas.module.css";

export default function VentasClient({ initialOrders, products }: { initialOrders: Order[], products: Product[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Rango de fechas por defecto: últimos 30 días
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 30);
  
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtrado de órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const oDate = new Date(o.date).getTime();
      const sDate = new Date(startDate).getTime();
      const eDate = new Date(endDate).getTime() + 86400000; // Add 1 day to include end date fully
      return oDate >= sDate && oDate <= eDate;
    });
  }, [orders, startDate, endDate]);

  // Resumen financiero
  const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const pendingCount = filteredOrders.filter(o => o.status === "Pagado" || o.status === "Preparando Pedido").length;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    // En producción, aquí harías un fetch para actualizar en Supabase
  };

  const getProductInfo = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handleExport = () => {
    const header = "N_Orden,Fecha,Cliente,RUT,Email,Estado,Total\n";
    const rows = filteredOrders.map(o => {
      const date = new Date(o.date).toLocaleDateString('es-CL');
      return `"${o.orderNumber}","${date}","${o.clientName}","${o.clientRut}","${o.clientEmail}","${o.status}",${o.total}`;
    }).join("\n");
        
    const csvContent = header + rows;
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `spm_ventas_${startDate}_al_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Ventas & Órdenes</h1>
          <p className={styles.pageSubtitle}>
            Gestión de pedidos y resúmenes financieros
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateFilter}>
            <Calendar size={16} className={styles.dateIcon} />
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
            <span>-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <button className={styles.btnSecondary} onClick={handleExport}><Download size={16} /> Exportar Reporte</button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>INGRESOS GENERADOS</span>
            <DollarSign size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValueGreen}>{formatCLP(totalRevenue)}</div>
          <div className={styles.mcFooterText}>En rango seleccionado</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>TOTAL ÓRDENES</span>
            <ShoppingBag size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValue}>{totalOrders}</div>
          <div className={styles.mcFooterText}>Pedidos concretados</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>TICKET PROMEDIO</span>
            <TrendingUp size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValue}>{formatCLP(avgTicket)}</div>
          <div className={styles.mcFooterText}>Gasto promedio por cliente</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>TAREAS PENDIENTES</span>
            <Clock size={16} className={styles.mcIconOrange} />
          </div>
          <div className={styles.mcValueOrange}>{pendingCount}</div>
          <div className={styles.mcFooterTextOrange}>Órdenes por despachar</div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Listado de Órdenes</h2>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>PRODUCTOS</th>
                <th>CLIENTE</th>
                <th>N° ORDEN</th>
                <th>FECHA</th>
                <th>TOTAL</th>
                <th>ESTADO DEL PEDIDO</th>
                <th>DETALLE</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>No hay órdenes en este rango de fechas.</td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const firstProduct = getProductInfo(order.items[0].productId);
                  const img = firstProduct ? displayImages(firstProduct)[0] : null;
                  const extraItems = order.items.length - 1;

                  return (
                    <tr key={order.id}>
                      <td>
                        <div className={styles.productCell}>
                          {img && (
                            <Image src={img.src} alt={img.alt} width={40} height={40} className={styles.productImg} />
                          )}
                          {extraItems > 0 && (
                            <div className={styles.extraBadge}>+{extraItems}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.clientInfo}>
                          <span className={styles.clientName}>{order.clientName}</span>
                          <span className={styles.clientRut}>{order.clientRut}</span>
                        </div>
                      </td>
                      <td><span className={styles.orderBadge}>{order.orderNumber}</span></td>
                      <td>{new Date(order.date).toLocaleDateString('es-CL')}</td>
                      <td className={styles.priceCell}>{formatCLP(order.total)}</td>
                      <td>
                        <div className={styles.statusWrapper}>
                          <select 
                            className={`${styles.statusSelect} ${styles[`status_${order.status.replace(/\s+/g, '')}`]}`}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          >
                            <option value="Pagado">Pagado (Nuevo)</option>
                            <option value="Preparando Pedido">Preparando Pedido</option>
                            <option value="Pedido Entregado">Pedido Entregado</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <button className={styles.iconBtn} onClick={() => setSelectedOrder(order)} title="Ver detalles">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Detalle {selectedOrder.orderNumber}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <div className={styles.modalCol}>
                  <h4 className={styles.colTitle}>Información del Cliente</h4>
                  <p><strong>Nombre:</strong> {selectedOrder.clientName}</p>
                  <p><strong>RUT:</strong> {selectedOrder.clientRut}</p>
                  <p><strong>Email:</strong> {selectedOrder.clientEmail}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.clientPhone}</p>
                  <p><strong>Dirección:</strong> {selectedOrder.clientAddress}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleString('es-CL')}</p>
                </div>
                
                <div className={styles.modalCol}>
                  <h4 className={styles.colTitle}>Estado Actual</h4>
                  <div className={`${styles.statusBadge} ${styles[`statusBadge_${selectedOrder.status.replace(/\s+/g, '')}`]}`}>
                    {selectedOrder.status === 'Pedido Entregado' ? <CheckCircle size={16} /> : <Package size={16} />}
                    {selectedOrder.status}
                  </div>
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                      Actualizar Estado
                    </label>
                    <select 
                      className={styles.modalSelect}
                      value={selectedOrder.status}
                      onChange={(e) => {
                        handleStatusChange(selectedOrder.id, e.target.value as OrderStatus);
                        setSelectedOrder({...selectedOrder, status: e.target.value as OrderStatus});
                      }}
                    >
                      <option value="Pagado">Pagado (Nuevo)</option>
                      <option value="Preparando Pedido">Preparando Pedido</option>
                      <option value="Pedido Entregado">Pedido Entregado</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <h4 className={styles.colTitle} style={{ marginTop: '2rem' }}>Artículos del Pedido</h4>
              <div className={styles.itemsList}>
                {selectedOrder.items.map((item, idx) => {
                  const product = getProductInfo(item.productId);
                  const img = product ? displayImages(product)[0].src : '/placeholder-cap.png';
                  
                  return (
                    <div key={idx} className={styles.itemRow}>
                      <Image src={img} alt="Product" width={50} height={50} className={styles.itemImg} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{product?.name || "Producto desconocido"}</p>
                        <p className={styles.itemBrand}>{product?.brand || ""}</p>
                      </div>
                      <div className={styles.itemPriceQty}>
                        <span className={styles.itemQty}>{item.quantity}x</span>
                        <span className={styles.itemPrice}>{formatCLP(item.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className={styles.modalTotal}>
                <span>Total pagado</span>
                <span className={styles.totalAmount}>{formatCLP(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
