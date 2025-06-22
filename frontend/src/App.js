import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import './App.css';
import Swal from 'sweetalert2';
import ActionButton from './components/ActionButton';
import { Eye, Pencil, Trash2 } from 'lucide-react';

function App() {
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category_id: '',
    image: null
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleEdit = (product) => {
    setIsEdit(true);
    setEditingId(product.id);
    setShowModal(true);
    setForm({
      name: product.name,
      price: Number(product.price).toLocaleString('id-ID'),
      stock: product.stock,
      description: product.description,
      category_id: String(product.category_id),
      image: product.image,
    });
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: `Delete "${product.name}"?`,
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#b2bec3',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/products/${product.id}`)
          .then(() => {
            Swal.fire('Deleted!', 'The product has been removed.', 'success');
            fetchProducts(); // refresh list
          })
          .catch(err => {
            console.error(err);
            Swal.fire('Error', 'Failed to delete product.', 'error');
          });
      }
    });
  };

const handleView = (product) => {
  setSelectedProduct(product);
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price.replace(/\./g, ''));
    formData.append('stock', form.stock);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);

    if (form.image instanceof File) {
      formData.append('image', form.image);
    }

    if (isEdit) {
      console.log('🛠 Editing product ID:', editingId);
      // UPDATE
      axios.put(`http://localhost:5000/products/${editingId}`, formData)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Product updated!', timer: 3000, showConfirmButton: false });
          resetForm();
        }).catch(err => console.error(err));
    } else {
      // INSERT
      axios.post('http://localhost:5000/products', formData)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Product added!', timer: 3000, showConfirmButton: false });
          resetForm();
        }).catch(err => console.error(err));
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditingId(null);
    setForm({
      name: '',
      price: '',
      stock: '',
      description: '',
      category_id: '',
      image: null
    });
    fetchProducts(); 
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">Indah Store</div>
        <nav className="nav-links">
          <a href="/" className="active">Products</a>
          <a href="/">Categories</a>
        </nav>
      </header>

      <div className="app-container">
        <h1>🛍️ Product List</h1>

          <button
            className="add-button"
            onClick={() => {
              setIsEdit(false); 
              setForm({
                name: '',
                price: '',
                stock: '',
                description: '',
                category_id: '',
                image: null
              });
              setShowModal(true);
            }}
          >
          <span className="icon-wrap"><Plus size={18} /></span>
          <span className="text-wrap">Add Product</span>
        </button>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setForm({ ...form, price: Number(raw).toLocaleString('id-ID') });
                    }}
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    min={1}
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="description"
                    placeholder="Product Description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    required
                    style={{
                      resize: 'vertical',
                      padding: '10px',
                      fontSize: '1rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  />
                  {isEdit && form.image && typeof form.image === 'string' && (
                    <div style={{ marginBottom: '5px' }}>
                      <p>Current Product Image:</p>
                      <img
                        src={`http://localhost:5000${form.image}`}
                        alt="Product Preview"
                        style={{
                          maxHeight: '100px',
                          objectFit: 'cover',
                          width: '100px',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  )}
                  <label htmlFor="image">
                    {isEdit ? 'Change Product Image' : 'Upload Product Image'}
                  </label>
                  <input
                    id="image"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!isEdit} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit">{isEdit ? 'Update' : 'Save'}</button>
                  </div>
                </form>
            </div>
          </div>
        )}

        {/* Show View  */}
        {selectedProduct && (
          <div className="detail-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="detail-modal-content">
                <div className="image-section">
                  <img
                    src={`http://localhost:5000${selectedProduct.image}`}
                    alt={selectedProduct.name}
                  />
                </div>
                <div className="info-section">
                  <h3>{selectedProduct.name}</h3>
                  <div className="info-row">
                    <span className="label">Price</span>
                    <span className="value">: Rp {Number(selectedProduct.price).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Stock</span>
                    <span className="value">: {selectedProduct.stock}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Category</span>
                    <span className="value">: {selectedProduct.category}</span>
                  </div>
                  <div className="info-row description-row">
                    <span className="label">Description</span>
                    <span className="value">: {selectedProduct.description}</span>
                  </div>

                  <div className="detail-footer">
                    <button className="close-button" onClick={() => setSelectedProduct(null)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Products */}
        <div className="product-grid">
          {products
          .filter((p) =>
            p.name.toLowerCase().includes(searchName.toLowerCase()) &&
            (searchCategory === '' || p.category === searchCategory)
          )
          .map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="category">Category: {p.category}</p>
              <p className="price">
                Rp {Number(p.price).toLocaleString('id-ID')}
              </p>

              <div className="action-buttons">
                <ActionButton
                  icon={Eye}
                  label="View"
                  onClick={() => handleView(p)}
                />
                <ActionButton
                  icon={Pencil}
                  label="Edit"
                  onClick={() => handleEdit(p)}
                  color="#ffeaa7"
                />
                <ActionButton
                  icon={Trash2}
                  label="Delete"
                  onClick={() => handleDelete(p)}
                  color="#fab1a0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
