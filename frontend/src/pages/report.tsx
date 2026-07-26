import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { productApi } from "../lib/api";
import type { InventoryStats, Product } from "../types";

function computeStats(products: Product[]): InventoryStats {
  const byCategory: Record<string, number> = {};
  let totalValue = 0;
  let lowStock = 0;
  let outOfStock = 0;

  for (const p of products) {
    totalValue += (p.price || 0) * (p.quantity || 0);
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    if (p.quantity === 0) outOfStock++;
    else if (p.quantity <= 10) lowStock++;
  }

  return {
    totalProducts: products.length,
    totalValue,
    lowStock,
    outOfStock,
    byCategory,
  };
}

export default function Report() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    productApi
      .getAll()
      .then(setProducts)
      .catch(() => setError("Could not load inventory data."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => computeStats(products), [products]);
  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.price * b.quantity - a.price * b.quantity).slice(0, 5),
    [products]
  );

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Layout title="Reports" subtitle="Inventory overview and analytics">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total products</span>
          <span className="stat-value">{stats.totalProducts}</span>
        </div>
        <div className="stat-card accent">
          <span className="stat-label">Inventory value</span>
          <span className="stat-value">${stats.totalValue.toLocaleString()}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">Low stock (≤10)</span>
          <span className="stat-value">{stats.lowStock}</span>
        </div>
        <div className="stat-card danger">
          <span className="stat-label">Out of stock</span>
          <span className="stat-value">{stats.outOfStock}</span>
        </div>
      </div>

      <div className="report-grid">
        <section className="card">
          <h2>By category</h2>
          {Object.keys(stats.byCategory).length === 0 ? (
            <p className="empty-text">No products yet.</p>
          ) : (
            <ul className="category-list">
              {Object.entries(stats.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <li key={cat}>
                    <span>{cat}</span>
                    <span className="badge">{count}</span>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Top value items</h2>
          {topProducts.length === 0 ? (
            <p className="empty-text">No products yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>${(p.price * p.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </Layout>
  );
}
