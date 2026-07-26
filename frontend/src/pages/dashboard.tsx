import { useEffect, useMemo, useState, type FormEvent } from "react";
import Layout from "../components/Layout";
import { productApi, userApi } from "../lib/api";
import type { Product, User } from "../types";

const CATEGORIES = ["Electronics", "Clothing", "Food", "Other"];
const EMPTY_PRODUCT = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  description: "",
  sku: "",
  photo: null as File | null,
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([userApi.getUser(), productApi.getAll()])
      .then(([u, p]) => {
        setUser(u);
        setProducts(p);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const updateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const formData = new FormData();
      formData.append("name", selectedProduct.name);
      formData.append("category", selectedProduct.category);
      formData.append("price", selectedProduct.price.toString());
      formData.append("quantity", selectedProduct.quantity.toString());
      formData.append("description", selectedProduct.description);
      formData.append("sku", selectedProduct.sku);
      if (editPhoto) {
        formData.append("image", editPhoto);
      }

      const res = await productApi.update(selectedProduct._id, formData);
      setProducts((prev) => prev.map((p) => (p._id === selectedProduct._id ? res.data : p)));
      setSelectedProduct(null);
      setEditPhoto(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Update failed.";
      setError(msg);
    }
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await productApi.delete(selectedProduct._id);
      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));
      setSelectedProduct(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Delete failed.";
      setError(msg);
    }
  };

  const createProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("price", newProduct.price);
      formData.append("quantity", newProduct.quantity);
      formData.append("description", newProduct.description);
      formData.append("sku", newProduct.sku);
      if (newProduct.photo) formData.append("image", newProduct.photo);

      const res = await productApi.create(formData);
      setProducts((prev) => [...prev, res.data]);
      setShowCreatePopup(false);
      setNewProduct(EMPTY_PRODUCT);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Create failed.";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Layout
      title="Dashboard"
      subtitle={user?.name ? `Welcome back, ${user.name}` : "Manage your products"}
      actions={
        <button type="button" className="btn btn-primary" onClick={() => setShowCreatePopup(true)}>
          + Add product
        </button>
      }
    >
      {error && (
        <div className="alert alert-error">
          {error}
          <button type="button" className="alert-close" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="result-count">{filteredProducts.length} products</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h2>No products found</h2>
          <p>Add your first product to get started.</p>
          <button type="button" className="btn btn-primary" onClick={() => setShowCreatePopup(true)}>
            Add product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p) => (
            <article
              key={p._id}
              className={`product-card ${p.quantity === 0 ? "out-of-stock" : p.quantity <= 10 ? "low-stock" : ""}`}
              onClick={() => {
                setSelectedProduct(p);
                setEditPhoto(null);
              }}
            >
              <div className="product-image">
                <img
                  src={
                    p.photo ||
                    "https://res.cloudinary.com/dduozzr2g/image/upload/v1777920605/default-user_nscsn1.jpg"
                  }
                  alt={p.name}
                />
                {p.quantity <= 10 && (
                  <span className="stock-badge">{p.quantity === 0 ? "Out of stock" : "Low stock"}</span>
                )}
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="product-sku">SKU: {p.sku}</p>
                <div className="product-meta">
                  <span className="price">${p.price}</span>
                  <span className="qty">Qty: {p.quantity}</span>
                </div>
                <span className="category-tag">{p.category}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => { setSelectedProduct(null); setEditPhoto(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit product</h2>
              <button type="button" className="modal-close" onClick={() => { setSelectedProduct(null); setEditPhoto(null); }}>
                ×
              </button>
            </div>
            <form onSubmit={updateProduct} className="form-stack">
              <label>
                Name
                <input
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Category
                <select
                  value={selectedProduct.category}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })
                    }
                    required
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    min="0"
                    value={selectedProduct.quantity}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, quantity: Number(e.target.value) })
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, description: e.target.value })
                  }
                  rows={3}
                />
              </label>
              <label>
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditPhoto(e.target.files?.[0] || null)}
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-danger" onClick={deleteProduct}>
                  Delete
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreatePopup && (
        <div className="modal-overlay" onClick={() => setShowCreatePopup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add product</h2>
              <button type="button" className="modal-close" onClick={() => setShowCreatePopup(false)}>
                ×
              </button>
            </div>
            <form onSubmit={createProduct} className="form-stack">
              <label>
                Name
                <input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </label>
              <label>
                SKU
                <input
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  required
                />
              </label>
              <label>
                Category
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    min="0"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    required
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  required
                />
              </label>
              <label>
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, photo: e.target.files?.[0] || null })
                  }
                />
              </label>
              <button type="submit" className="btn btn-primary btn-full">
                Create product
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
