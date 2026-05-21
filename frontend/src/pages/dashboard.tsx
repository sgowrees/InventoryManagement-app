import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import '../css/dashboard.css'
import Sidebar from '../components/Sidebar'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {

    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', quantity: '', description: '', sku: '', photo: null as File | null });
    
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [priceFilterInput, setPriceFilterInput] = useState<string[]>([]);
    const [quantityFilterInput, setQuantityFilterInput] = useState<string[]>([]);
    const [categoryFilterInput, setCategoryFilterInput] = useState<string[]>([]);
    const [priceFilter, setPriceFilter] = useState<string[]>([]);
    const [quantityFilter, setQuantityFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const userRes = await axios.get(
                    `${BACKEND_URL}/api/users/getUser`,
                    { withCredentials: true }
                );

                setUser(userRes.data);

                const productRes = await axios.get(
                    `${BACKEND_URL}/api/products`,
                    { withCredentials: true }
                );

                setProducts(productRes.data || []);

            } catch (error) {
                console.log(error);
                setProducts([]); // Set empty array on error
            }

        };

        fetchData();

    }, []); 



    const filteredProducts = (products || []).filter((p) => {

        const matchesSearch =
            p && p.name && p.name.toLowerCase().includes((search || '').toLowerCase());

        const matchesCategory =
            categoryFilter.length === 0 ||
            (p && p.category && categoryFilter.includes(p.category));

        const matchesPrice =
            priceFilter.length === 0 ||
            priceFilter.some((range) => {
                const price = p?.price;
                if (typeof price !== 'number') return false;

                if (range === "0-10") return price <= 10;
                if (range === "10-50") return price > 10 && price <= 50;
                if (range === "50-100") return price > 50 && price <= 100;
                if (range === "100-200") return price > 100 && price <= 200;

                return false;
            });

        const matchesQuantity =
            quantityFilter.length === 0 ||
            quantityFilter.some((range) => {
                const quantity = p?.quantity;
                if (typeof quantity !== 'number') return false;

                if (range === "0-10") return quantity <= 10;
                if (range === "10-50") return quantity > 10 && quantity <= 50;
                if (range === "50-100") return quantity > 50 && quantity <= 100;
                if (range === "100+") return quantity > 100;

                return false;
            });

        return matchesSearch && matchesCategory && matchesPrice && matchesQuantity;
    });
    const updateProduct = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', selectedProduct.name);
            formData.append('category', selectedProduct.category);
            formData.append('price', selectedProduct.price.toString());
            formData.append('quantity', selectedProduct.quantity.toString());
            formData.append('description', selectedProduct.description);
            formData.append('sku', selectedProduct.sku);
            if (selectedProduct.photo && typeof selectedProduct.photo !== 'string') {
                formData.append('image', selectedProduct.photo);
            }

            const res = await axios.patch(
                `${BACKEND_URL}/api/products/${selectedProduct._id}`,
                formData,
                {
                    withCredentials: true
                }
            );
            //update frontend instantly
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === selectedProduct._id ? res.data : p
                )
            );
            setSelectedProduct(null); // Close the popup after successful update

        } catch (error) {
            console.log(error);
            // Don't close popup on error so user can see the error and try again
        }
    }
    const deleteProduct = async () => {

        try {

            await axios.delete(
                `${BACKEND_URL}/api/products/${selectedProduct._id}`,
                {
                    withCredentials: true
                }
            );

            // remove instantly from frontend
            setProducts((prev) =>
                prev.filter(
                    (p) => p._id !== selectedProduct._id
                )
            );

            setSelectedProduct(null);

        } 
         catch (error: any) {
            console.log(error.response.data)
            
        }

    }
    const createProduct = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('category', newProduct.category);
            formData.append('price', newProduct.price);
            formData.append('quantity', newProduct.quantity);
            formData.append('description', newProduct.description);
            formData.append('sku', newProduct.sku);
            if (newProduct.photo) {
                formData.append('image', newProduct.photo);
            }

            const res = await axios.post(
                `${BACKEND_URL}/api/products`,
                formData,
                { 
                    withCredentials: true
                }
            );
            console.log('Product created:', res.data); // Debug log
            setProducts(prev => [...prev, res.data]);
            setShowCreatePopup(false);
            setNewProduct({ name: '', category: '', price: '', quantity: '', description: '', sku: '', photo: null });
        } catch (error: any) {
            console.log('Error creating product:', error);
            console.log('Error response:', error.response?.data);
        }
    }







    return (
        <div>
            <h1>Dashboard{user?.name ? ` - ${user.name}` : ""}</h1>

            {/* TOPBAR */}
            <nav className="topnav">

                <div className="topnav-left">

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="searchbar"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />

                    {/* PRICE DROPDOWN */}
                    <div className="dropdown">

                        <button className="dropdown-btn">
                            Price ▼
                        </button>

                        <div className="dropdown-content">

                            <label>
                                <input
                                    type="checkbox"
                                    checked={priceFilterInput.includes("0-10")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPriceFilterInput([...priceFilterInput, "0-10"]);
                                        } else {
                                            setPriceFilterInput(priceFilterInput.filter(x => x !== "0-10"));
                                        }
                                    }}
                                />
                                $0 - $10
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={priceFilterInput.includes("10-50")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPriceFilterInput([...priceFilterInput, "10-50"]);
                                        } else {
                                            setPriceFilterInput(priceFilterInput.filter(x => x !== "10-50"));
                                        }
                                    }}
                                />
                                $10 - $50
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={priceFilterInput.includes("50-100")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPriceFilterInput([...priceFilterInput, "50-100"]);
                                        } else {
                                            setPriceFilterInput(priceFilterInput.filter(x => x !== "50-100"));
                                        }
                                    }}
                                />
                                $50 - $100
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={priceFilterInput.includes("100-200")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPriceFilterInput([...priceFilterInput, "100-200"]);
                                        } else {
                                            setPriceFilterInput(priceFilterInput.filter(x => x !== "100-200"));
                                        }
                                    }}
                                />
                                $100 - $200
                            </label>

                        </div>

                    </div>

                    {/* QUANTITY DROPDOWN */}
                    <div className="dropdown">

                        <button className="dropdown-btn">
                            Quantity ▼
                        </button>

                        <div className="dropdown-content">

                            <label>
                                <input
                                    type="checkbox"
                                    checked={quantityFilterInput.includes("0-10")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setQuantityFilterInput([...quantityFilterInput, "0-10"]);
                                        } else {
                                            setQuantityFilterInput(quantityFilterInput.filter(x => x !== "0-10"));
                                        }
                                    }}
                                />
                                0 - 10
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={quantityFilterInput.includes("10-50")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setQuantityFilterInput([...quantityFilterInput, "10-50"]);
                                        } else {
                                            setQuantityFilterInput(quantityFilterInput.filter(x => x !== "10-50"));
                                        }
                                    }}
                                />
                                10 - 50
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={quantityFilterInput.includes("50-100")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setQuantityFilterInput([...quantityFilterInput, "50-100"]);
                                        } else {
                                            setQuantityFilterInput(quantityFilterInput.filter(x => x !== "50-100"));
                                        }
                                    }}
                                />
                                50 - 100
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={quantityFilterInput.includes("100+")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setQuantityFilterInput([...quantityFilterInput, "100+"]);
                                        } else {
                                            setQuantityFilterInput(quantityFilterInput.filter(x => x !== "100+"));
                                        }
                                    }}
                                />
                                100+
                            </label>

                        </div>

                    </div>

                    {/* CATEGORY DROPDOWN */}
                    <div className="dropdown">

                        <button className="dropdown-btn">
                            Category ▼
                        </button>

                        <div className="dropdown-content">

                            <label>
                                <input
                                    type="checkbox"
                                    checked={categoryFilterInput.includes("Electronics")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCategoryFilterInput([...categoryFilterInput, "Electronics"]);
                                        } else {
                                            setCategoryFilterInput(categoryFilterInput.filter(x => x !== "Electronics"));
                                        }
                                    }}
                                />
                                Electronics
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={categoryFilterInput.includes("Clothing")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCategoryFilterInput([...categoryFilterInput, "Clothing"]);
                                        } else {
                                            setCategoryFilterInput(categoryFilterInput.filter(x => x !== "Clothing"));
                                        }
                                    }}
                                />
                                Clothing
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={categoryFilterInput.includes("Food")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCategoryFilterInput([...categoryFilterInput, "Food"]);
                                        } else {
                                            setCategoryFilterInput(categoryFilterInput.filter(x => x !== "Food"));
                                        }
                                    }}
                                />
                                Food
                            </label>

                        </div>

                    </div>

                    {/* SEARCH BUTTON */}
                    <button
                        type="button"
                        className="search-btn"
                        onClick={() => {
                            setSearch(searchInput);
                            setPriceFilter(priceFilterInput);
                            setQuantityFilter(quantityFilterInput);
                            setCategoryFilter(categoryFilterInput);
                        }}
                    >
                        Search
                    </button>

                </div>

                <div className="topnav-right">

                    <button className="create-btn" onClick={() => setShowCreatePopup(true)}>
                        Create Product
                    </button>

                </div>

            </nav>

            <div className="layout">

                {/* Sidebar Content */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


                {/* Main Content */}
                <main className="main-content">

                    <div id="sidebar-container"></div>

                    <div className="grid-container">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p: any, i: number) => (
                                <div
                                    className="grid-item"
                                    key={i}
                                    onClick={() => setSelectedProduct(p)}
                                >
                                    <p>{i + 1}. {p.name || 'Unnamed Product'}</p>
                                    <p>SKU: {p.sku || 'N/A'}</p>
                                    <p>Price: {p.price || 'N/A'}</p>
                                    <p>Quantity: {p.quantity || 'N/A'}</p>
                                    <p>Category: {p.category || 'N/A'}</p>
                                    <img src={p.photo || ''} alt="product image" />
                                    <p>Description: {p.description || 'No description'}</p>
                                </div>
                            ))
                        ) : (
                            <p>No products</p>
                        )}
                    </div>

                </main>

            </div>
            



            {/* POPUP */}
            {selectedProduct && (
                <div className="popup">
                    <div className="popup-content">
                        <button onClick={() => setSelectedProduct(null)}>X</button>
                        <form onSubmit={updateProduct}>

                            <input
                                type="text"
                                value={selectedProduct.name}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        name: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                value={selectedProduct.category}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        category: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                value={selectedProduct.price}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        price: Number(e.target.value)
                                    })
                                }
                            />

                            <input
                                type="number"
                                value={selectedProduct.quantity}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        quantity: Number(e.target.value)
                                    })
                                }
                            />

                            <input
                                type="text"
                                value={selectedProduct.description}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        description: e.target.value
                                    })
                                }
                            />
                            <input
                                type="hidden"
                                value={selectedProduct.sku}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        photo: e.target.files ? e.target.files[0] : selectedProduct.photo
                                    })
                                }
                            />

                            <button type="submit">
                                Update Product
                            </button>

                        </form>
                        <button onClick={deleteProduct}>Delete</button>

                    </div>

                </div>

            )}



            {/* CREATE POPUP */}
            {showCreatePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <button onClick={() => setShowCreatePopup(false)}>X</button>
                        <form onSubmit={createProduct}>

                            <input
                                type="text"
                                placeholder="Name"
                                value={newProduct.name}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        name: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Category"
                                value={newProduct.category}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        category: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        price: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newProduct.quantity}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        quantity: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        description: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="SKU"
                                value={newProduct.sku}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        sku: e.target.value
                                    })
                                }
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        photo: e.target.files ? e.target.files[0] : null
                                    })
                                }
                            />

                            <button type="submit">
                                Create Product
                            </button>

                        </form>

                    </div>

                </div>
            )}

        </div>


    );
}

export default Dashboard;