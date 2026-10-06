"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, Save, Image as ImageIcon, CheckCircle, UploadCloud, Plus } from "lucide-react";
import Link from "next/link";
import { Product, buildSeoTitle, buildSeoDescription, displayImages } from "@/lib/products";
import styles from "./Editor.module.css";

export default function ProductEditorClient({ product }: { product: Product | null }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    price: product?.price?.toString() || "70000",
    stock: product?.stock?.toString() || "1",
    isActive: product !== null ? product.isActive : true,
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
    description: product?.description || "",
  });

  const [images, setImages] = useState(product ? displayImages(product) : []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const autoSeoTitle = buildSeoTitle(formData.brand, formData.name);
  const autoSeoDesc = buildSeoDescription(formData.brand, formData.name);

  const displayTitle = formData.seoTitle || autoSeoTitle || "Título SEO (Automático)";
  const displayDesc = formData.seoDescription || autoSeoDesc || "Descripción SEO (Automática)";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Convertir a WebP con Canvas en frontend (como pedido)
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      
      // Redimensionar si es muy grande (max 1000px)
      if (width > 1000) {
        height = Math.round((height * 1000) / width);
        width = 1000;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Generar WebP con 0.8 de calidad
      const webpUrl = canvas.toDataURL("image/webp", 0.8);
      
      setImages(prev => [
        ...prev.filter(i => i.src && !i.src.includes('placeholder')), 
        { src: webpUrl, alt: `${formData.brand} ${formData.name}` }
      ]);
    };
  };

  const handleSave = async () => {
    alert("Guardando producto en Supabase...");
    // Acá iría la llamada API real
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/productos" className={styles.backBtn}>
            <ArrowLeft size={18} />
          </Link>
          <h2 className={styles.title}>{product ? "Editar Producto" : "Nuevo Producto"}</h2>
        </div>
        <button onClick={handleSave} className={styles.saveBtn}>
          <Save size={18} /> Guardar Cambios
        </button>
      </div>

      <div className={styles.grid}>
        {/* Columna Principal */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Información General</h3>
            <div className={styles.formGroup}>
              <label>Nombre / Modelo</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Ny azul marino" />
            </div>
            <div className={styles.formGroup}>
              <label>Marca</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Ej. Cash Only" />
            </div>
            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Descripción visible en la tienda..." />
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Optimización SEO Google</h3>
            <p className={styles.seoHint}>Optimiza cómo se ve tu producto en los resultados de búsqueda de Google.</p>
            
            <div className={styles.formGroup}>
              <label>Título SEO (Meta Title)</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} placeholder={autoSeoTitle} />
            </div>
            
            <div className={styles.formGroup}>
              <label>Descripción SEO (Meta Description)</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} rows={3} placeholder={autoSeoDesc} />
            </div>

            <div className={styles.googlePreview}>
              <span className={styles.googleUrl}>spm-streetwear.cl › producto › {product?.slug || 'nuevo'}</span>
              <h4 className={styles.googleTitle}>{displayTitle}</h4>
              <p className={styles.googleDesc}>{displayDesc}</p>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Imágenes WebP</h3>
            <p className={styles.seoHint}>Las imágenes se convertirán automáticamente a WebP para carga ultra rápida y mejor SEO.</p>
            
            <div className={styles.imageUploadArea}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} hidden />
              
              {images.length > 0 && !images[0].src.includes('placeholder') ? (
                <div className={styles.imagesGrid}>
                  {images.map((img, i) => (
                    <div key={i} className={styles.imageWrapper}>
                      <Image src={img.src} alt={img.alt} width={150} height={150} className={styles.uploadedImg} />
                      <div className={styles.imageOverlay}>
                        <CheckCircle size={24} color="#10b981" />
                        <span className={styles.webpBadge}>WebP</span>
                      </div>
                    </div>
                  ))}
                  <button className={styles.uploadMoreBtn} onClick={() => fileInputRef.current?.click()}>
                    <Plus size={24} />
                  </button>
                </div>
              ) : (
                <div className={styles.uploadEmpty} onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={48} className={styles.uploadIcon} />
                  <p>Haz clic para subir una imagen</p>
                  <span>Soporta JPG, PNG, HEIC. Se optimizará a WebP.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Secundaria */}
        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Estado</h3>
            <div className={styles.formGroup}>
              <select name="isActive" value={formData.isActive ? "true" : "false"} onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.value === "true"}))}>
                <option value="true">Activo (Visible)</option>
                <option value="false">Oculto (Borrador)</option>
              </select>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Inventario & Precio</h3>
            <div className={styles.formGroup}>
              <label>Precio (CLP)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Stock Disponible</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
