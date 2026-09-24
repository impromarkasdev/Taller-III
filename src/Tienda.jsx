import { useEffect, useMemo, useState } from 'react';

const API_URL = 'https://fakestoreapi.com/products';

function ProductCard({ product }) {
  return (
    <article className="card product-card h-100 shadow-sm">
      <div className="product-image-wrap">
        <img className="card-img-top product-image" src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="card-body d-flex flex-column">
        <span className="badge rounded-pill text-bg-light align-self-start mb-2">{product.category}</span>
        <h2 className="h5 card-title">{product.title}</h2>
        <p className="card-text text-secondary small flex-grow-1">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center gap-2 mt-3">
          <strong className="price">${product.price.toFixed(2)}</strong>
          <button className="btn btn-success btn-sm" type="button">Ver producto</button>
        </div>
      </div>
    </article>
  );
}

export default function Tienda() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError('No fue posible cargar los productos. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => ['Todos', ...new Set(products.map((product) => product.category))], [products]);
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todos' || product.category === category;
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [products, category, search]);

  return (
    <div className="app-shell">
      <header className="store-header">
        <nav className="navbar navbar-expand-lg container py-3" aria-label="Navegación principal">
          <a className="navbar-brand fw-bold text-white" href="#inicio">Taller<span>Store</span></a>
          <span className="text-white-50 small ms-auto">React Hooks · useEffect</span>
        </nav>
      </header>
      <main id="inicio" className="container py-4 py-lg-5">
        <section className="hero rounded-4 p-4 p-lg-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="eyebrow mb-2">Laboratorio 3 · Programación Web</p>
              <h1 className="display-5 fw-bold">Productos cargados desde una API con React.</h1>
              <p className="lead mb-0">Esta tienda usa el hook <code>useEffect</code> para solicitar datos a Fake Store API y renderizar componentes reutilizables.</p>
            </div>
            <div className="col-lg-5 text-lg-end"><span className="api-pill">● API conectada</span><p className="mt-3 mb-0 text-secondary">{products.length || '...'} productos disponibles</p></div>
          </div>
        </section>

        <section aria-labelledby="catalog-title">
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center mb-4">
            <div><p className="eyebrow mb-1">Catálogo</p><h2 id="catalog-title" className="h3 mb-0">Explora la colección</h2></div>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <label className="visually-hidden" htmlFor="search">Buscar producto</label>
              <input id="search" className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto..." />
              <label className="visually-hidden" htmlFor="category">Filtrar categoría</label>
              <select id="category" className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
            </div>
          </div>

          {loading && <div className="alert alert-info" role="status">Cargando productos desde Fake Store API...</div>}
          {error && <div className="alert alert-danger" role="alert">{error} <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => window.location.reload()}>Reintentar</button></div>}
          {!loading && !error && visibleProducts.length === 0 && <div className="alert alert-warning">No encontramos productos con esos criterios.</div>}
          <div className="row g-4">{visibleProducts.map((product) => <div className="col-sm-6 col-xl-4" key={product.id}><ProductCard product={product} /></div>)}</div>
        </section>
      </main>
      <footer className="footer py-4 mt-4"><div className="container d-flex flex-column flex-md-row justify-content-between gap-2"><span>Taller Store · React y Hooks</span><span>Fuente: fakestoreapi.com</span></div></footer>
    </div>
  );
}
